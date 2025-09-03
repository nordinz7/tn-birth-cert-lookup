# Tamil Nadu Birth Certificate Lookup by Registration Number

A static web application for looking up and downloading Tamil Nadu birth certificates using registration numbers.

## Features

- **Bilingual Support**: Available in both Tamil and English
- **Registration Number Validation**: Validates birth certificate registration number format (B-YYYY:XX-XXXX-XXXXXX)
- **PDF Viewer**: In-browser PDF viewing
- **Download**: Direct PDF download functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Ready**: Service worker support for offline functionality

## Usage

1. Enter your birth certificate registration number in the format: `B-YYYY:XX-XXXX-XXXXXX`
   - Example: `B-2025:33-9880-000123`
2. Click "Lookup Certificate" to load the PDF
3. Use "Download PDF" to save the certificate locally

## Registration Number Format

The birth certificate registration number should follow this pattern:

- `B-` prefix
- Year (4 digits)
- `:` separator
- District code (2 digits)
- `-` separator
- Registration number (4 digits)
- `-` separator
- Serial number (6 digits)

## Deployment

This project is configured for GitHub Pages deployment:

1. Push code to the `main` branch
2. GitHub Actions will automatically deploy to GitHub Pages
3. The site will be available at `https://yourusername.github.io/tn-birth-cert-lookup`

### Manual Setup for GitHub Pages

1. Go to your repository's Settings
2. Navigate to Pages section
3. Select "Deploy from a branch" as source
4. Choose `main` branch and `/ (root)` folder
5. Save the configuration

## Development

This is a static website using vanilla HTML, CSS, and JavaScript:

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling with Tamil font support
- `script.js` - Form validation and PDF handling logic

### Local Development

Simply open `index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Android Chrome)
- PDF viewing requires browsers with built-in PDF support

## Disclaimer

This is an unofficial tool for accessing Tamil Nadu birth certificates by registration number. Please verify all information with official government sources.

**Data Source**: [CRSTN.org](https://www.crstn.org)

## License

MIT License - see LICENSE file for details
