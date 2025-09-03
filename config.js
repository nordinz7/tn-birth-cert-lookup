// Environment configuration
const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://www.crstn.org/birth_death_tn/CORPBIRTHTAMIL/esign/signed_CORPBIRTHTAMIL_',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },
    
    // Application settings
    APP: {
        NAME: 'Tamil Nadu Birth Certificate Lookup by Registration Number',
        NAME_TAMIL: 'பதிவு எண் மூலம் தமிழ்நாடு பிறப்புச் சான்றிதழ் தேடல்',
        VERSION: '1.0.0',
        AUTHOR: 'TN Birth Cert Team',
        DESCRIPTION: 'Official Tamil Nadu Birth Certificate Lookup Portal by Registration Number',
        DESCRIPTION_TAMIL: 'பதிவு எண் மூலம் அதிகாரபூர்வ தமிழ்நாடு பிறப்புச் சான்றிதழ் தேடல் போர்டல்'
    },
    
    // Validation rules
    VALIDATION: {
        ID_PATTERN: /^B-\d{4}:\d{2}-\d{4}-\d{6}$/,
        MIN_YEAR: 1950,
        MAX_YEAR: new Date().getFullYear()
    },
    
    // SEO Configuration
    SEO: {
        KEYWORDS: [
            'tamil nadu birth certificate',
            'birth certificate lookup',
            'registration number lookup',
            'தமிழ்நாடு பிறப்புச் சான்றிதழ்',
            'பதிவு எண் தேடல்',
            'online birth certificate',
            'tn birth certificate download',
            'birth registration tamil nadu',
            'crstn birth certificate',
            'tamil nadu government services'
        ],
        LOCALE: 'en-IN',
        REGION: 'Tamil Nadu, India'
    },
    
    // UI Configuration
    UI: {
        THEME: 'dark-classic',
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 500
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}