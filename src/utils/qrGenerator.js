import QRCode from 'qrcode';
import path from 'path';

// Only import fs when running on the server
const fs = typeof window === 'undefined' 
  ? require('fs').promises 
  : null;

const hints = {
  1: "First clue: Begin your journey",
  2: "Second hint: Look closer",
  3: "Third revelation: Trust the process",
  4: "Fourth insight: Break boundaries",
  5: "Fifth mystery: Connect the dots",
  6: "Sixth wisdom: Embrace the unknown",
  7: "Seventh secret: Challenge assumptions",
  8: "Eighth pointer: Think differently",
  9: "Ninth whisper: Follow intuition",
  10: "Final clue: Discover yourself"
};

export async function generateQRCodes() {
  // Only generate QR codes on the server side
  if (typeof window !== 'undefined') {
    return hints;
  }

  // Ensure fs is available (only on server)
  if (!fs) {
    console.error('File system not available');
    return hints;
  }

  const publicFolder = path.join(process.cwd(), 'public', 'qrcodes');
  
  // Ensure the directory exists
  try {
    await fs.mkdir(publicFolder, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }

  // Generate QR codes for each hint
  for (let i = 1; i <= 10; i++) {
    const url = `https://hackerz-treasure-hunt-9ci1.vercel.app/hint/${i}`;
    const qrPath = path.join(publicFolder, `hint-${i}.png`);
    
    try {
      await QRCode.toFile(qrPath, url, {
        color: {
          dark: '#000',  
          light: '#FFF'  
        }
      });
      console.log(`Generated QR code for hint ${i}`);
    } catch (error) {
      console.error(`Error generating QR code for hint ${i}:`, error);
    }
  }

  return hints;
}

export function getHint(hintNumber) {
  return hints[hintNumber] || "Hint not found";
}