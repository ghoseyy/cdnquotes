import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const allowedCategories = [
  'englishasset', 'hindi', 'urdu', 'Nepali', 'Love',
  'Inspiration', 'Motivation', 'Wisdom', 'Life'
];

// Better random number generator using crypto
function getSecureRandom(max) {
  const rand = crypto.randomBytes(4).readUInt32LE() / 0x100000000;
  return Math.floor(rand * max);
}

export default async function handler(req, res) {
  try {
    const { category } = req.query;
    
    if (!category || !allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const dir = path.join(process.cwd(), 'public', category, 'images');

    try {
      await fs.access(dir);
    } catch {
      return res.status(404).json({ error: 'Category folder not found' });
    }

    const files = await fs.readdir(dir);
    
    if (files.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    // Use crypto-secure random selection
    const randomImage = files[getSecureRandom(files.length)];
    
    // Add cache-busting query parameter
    const timestamp = Date.now();
    const imageUrl = `/${category}/images/${randomImage}?t=${timestamp}`;

    return res.status(200).json({ 
      url: imageUrl,
      totalImages: files.length
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}