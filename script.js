// Birth Certificate ID Validation and PDF Fetching
class BirthCertificateLookup {
    constructor() {
        // Use configuration from config.js
        this.config = typeof CONFIG !== 'undefined' ? CONFIG : this.getDefaultConfig();
        this.baseUrl = this.config.API.BASE_URL;
        this.timeout = this.config.API.TIMEOUT;
        this.retryAttempts = this.config.API.RETRY_ATTEMPTS;
        this.debounceTimer = null;

        this.initializeElements();
        this.attachEventListeners();
        this.initializeApp();
    }

    getDefaultConfig() {
        // Fallback configuration if CONFIG is not available
        return {
            API: {
                BASE_URL: 'https://www.crstn.org/birth_death_tn/CORPBIRTHTAMIL/esign/signed_CORPBIRTHTAMIL_',
                TIMEOUT: 30000,
                RETRY_ATTEMPTS: 3
            },
            VALIDATION: {
                ID_PATTERN: /^B-\d{4}:\d{2}-\d{4}-\d{6}$/,
                MIN_YEAR: 1950,
                MAX_YEAR: new Date().getFullYear()
            },
            UI: {
                THEME: 'dark-classic',
                ANIMATION_DURATION: 300,
                DEBOUNCE_DELAY: 500
            }
        };
    }

    initializeApp() {
        // Set up theme
        document.body.setAttribute('data-theme', this.config.UI.THEME);

        // Set up PWA install prompt
        this.setupPWAInstall();

        // Performance monitoring
        this.startPerformanceMonitoring();
    }

    initializeElements() {
        this.form = document.getElementById('certForm');
        this.certIdInput = document.getElementById('certId');
        this.errorMessage = document.getElementById('error-message');
        this.submitBtn = document.getElementById('submitBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newSearchBtn = document.getElementById('newSearchBtn');
        this.loading = document.getElementById('loading');
        
        // Modal elements
        this.pdfModal = document.getElementById('pdfModal');
        this.pdfModalViewer = document.getElementById('pdfModalViewer');
        this.downloadModalBtn = document.getElementById('downloadModalBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.modalBackdrop = this.pdfModal?.querySelector('.modal-backdrop');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.downloadBtn.addEventListener('click', () => this.downloadPDF());
        this.newSearchBtn.addEventListener('click', () => this.resetForm());
        this.certIdInput.addEventListener('input', () => this.clearError());
        
        // Modal event listeners
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.downloadModalBtn) {
            this.downloadModalBtn.addEventListener('click', () => this.downloadPDF());
        }
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.closeModal());
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.pdfModal && this.pdfModal.style.display !== 'none') {
                this.closeModal();
            }
        });
    }

    validateCertificateId(certId) {
        // Remove any spaces and convert to uppercase
        certId = certId.trim().toUpperCase();

        // Use pattern from configuration
        const pattern = this.config.VALIDATION.ID_PATTERN;

        if (!pattern.test(certId)) {
            return {
                valid: false,
                message: {
                    english: 'Invalid format. Use: B-YYYY:XX-XXXX-XXXXXX',
                    tamil: 'தவறான வடிவம். பயன்படுத்தவும்: B-YYYY:XX-XXXX-XXXXXX'
                }
            };
        }

        // Extract year and validate it's reasonable
        const year = parseInt(certId.split(':')[0].substring(2));
        const minYear = this.config.VALIDATION.MIN_YEAR;
        const maxYear = this.config.VALIDATION.MAX_YEAR;

        if (year < minYear || year > maxYear) {
            return {
                valid: false,
                message: {
                    english: `Invalid year. Must be ${minYear}-${maxYear}`,
                    tamil: `தவறான வருடம். ${minYear}-${maxYear} இடையில் இருக்க வேண்டும்`
                }
            };
        }

        return { valid: true, certId };
    }

    showError(message) {
        this.errorMessage.innerHTML = `
            <span class="english">${message.english}</span>
            <span class="tamil">${message.tamil}</span>
        `;
        this.errorMessage.style.display = 'block';
        this.certIdInput.classList.add('error');
    }

    clearError() {
        this.errorMessage.style.display = 'none';
        this.certIdInput.classList.remove('error');
    }

    showLoading() {
        this.loading.style.display = 'flex';
        this.submitBtn.disabled = true;
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.submitBtn.disabled = false;
    }

    async checkPDFExists(url, retryCount = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error('Error checking PDF:', error);

            // Retry logic
            if (retryCount < this.retryAttempts) {
                console.log(`Retrying... Attempt ${retryCount + 1}/${this.retryAttempts}`);
                await this.delay(1000 * (retryCount + 1)); // Exponential backoff
                return this.checkPDFExists(url, retryCount + 1);
            }

            return false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button (could add this to UI later)
            console.log('PWA install prompt available');
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            deferredPrompt = null;
        });
    }

    startPerformanceMonitoring() {
        // Basic performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
            });
        }
    }

    debounceInput(func, delay) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    constructPDFUrl(certId) {
        return `${this.baseUrl}${certId}.pdf`;
    }

    async handleSubmit(e) {
        e.preventDefault();

        const certId = this.certIdInput.value;
        const validation = this.validateCertificateId(certId);

        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        this.clearError();
        this.showLoading();

        const pdfUrl = this.constructPDFUrl(validation.certId);

        try {
            const exists = await this.checkPDFExists(pdfUrl);

            if (!exists) {
                this.hideLoading();
                this.showError({
                    english: 'Certificate not found. Please check the registration number and try again.',
                    tamil: 'சான்றிதழ் இல்லை. பதிவு எண்ணை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
                });
                return;
            }

            this.displayPDF(pdfUrl);
            this.hideLoading();

        } catch (error) {
            console.error('Error fetching PDF:', error);
            this.hideLoading();
            this.showError({
                english: 'Unable to connect to the certificate server. Please check your internet connection and try again.',
                tamil: 'சான்றிதழ் சேவையகத்துடன் இணைக்க முடியவில்லை. உங்கள் இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
            });
        }
    }

    displayPDF(pdfUrl) {
        // Open modal with PDF
        this.pdfModalViewer.src = pdfUrl;
        this.pdfModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Show additional buttons
        this.downloadBtn.style.display = 'inline-block';
        this.newSearchBtn.style.display = 'inline-block';
        this.downloadBtn.dataset.pdfUrl = pdfUrl;
        this.downloadModalBtn.dataset.pdfUrl = pdfUrl;
        
        // Update button text
        this.submitBtn.innerHTML = `
            <span class="english">Search Again</span>
            <span class="tamil">மீண்டும் தேடு</span>
        `;
        
        // Focus trap for accessibility
        this.closeModalBtn.focus();
    }
    
    closeModal() {
        this.pdfModal.style.display = 'none';
        this.pdfModalViewer.src = '';
        document.body.style.overflow = 'auto'; // Restore scroll
        this.certIdInput.focus(); // Return focus to input
    }

    downloadPDF() {
        const pdfUrl = this.downloadBtn.dataset.pdfUrl || this.downloadModalBtn.dataset.pdfUrl;
        if (!pdfUrl) return;

        // Extract certificate registration number from URL for filename
        const certId = pdfUrl.split('_').pop().replace('.pdf', '');

        // Create download link
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `TN_Birth_Certificate_${certId}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    resetForm() {
        this.form.reset();
        this.clearError();
        this.closeModal();
        this.downloadBtn.style.display = 'none';
        this.newSearchBtn.style.display = 'none';
        
        // Reset submit button
        this.submitBtn.innerHTML = `
            <span class="english">View Certificate</span>
            <span class="tamil">சான்றிதழ் காண்க</span>
        `;
        
        // Focus on input
        this.certIdInput.focus();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BirthCertificateLookup();
});

// Service Worker registration for offline capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}