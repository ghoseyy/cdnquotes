import fs from 'fs/promises';
import path from 'path';

const allowedCategories = [
  'englishasset', 'hindi', 'urdu', 'Nepali', 'Love',
  'Inspiration', 'Motivation', 'Wisdom', 'Life'
];

export default async function handler(req, res) {
  try {
    const { category } = req.query;
    
    if (!category || !allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Use absolute path
    const dir = path.join(process.cwd(), 'public', category, 'images');
    console.log('Checking directory:', dir);

    try {
      await fs.access(dir);
    } catch {
      console.error('Error: Directory not found ->', dir);
      return res.status(404).json({ error: 'Category folder not found' });
    }

    const files = await fs.readdir(dir);
    console.log('Files found:', files);

    if (files.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    const randomImage = files[Math.floor(Math.random() * files.length)];
    
    // Modified URL construction
    const imageUrl = `/${category}/images/${randomImage}`;

    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}