import { generateQRCodes } from '../utils/qrGenerator.js';

async function initializeQRCodes() {
  try {
    const hints = await generateQRCodes();
    console.log('QR Codes generation process completed');
    console.log('Hints:', hints);
    process.exit(0);
  } catch (error) {
    console.error('Error generating QR codes:', error);
    process.exit(1);
  }
}

initializeQRCodes();