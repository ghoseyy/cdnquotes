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

    const baseDir = process.cwd();
    console.log('Base directory:', baseDir);
    
    const dir = path.join(baseDir, 'public', category, 'images');
    console.log('Full path:', dir);

    // List contents of public directory
    try {
      const publicContents = await fs.readdir(path.join(baseDir, 'public'));
      console.log('Contents of public directory:', publicContents);
    } catch (e) {
      console.error('Error reading public directory:', e);
    }

    try {
      await fs.access(dir);
      console.log('Directory exists and is accessible');
    } catch (e) {
      console.error('Directory access error:', e);
      return res.status(404).json({ 
        error: 'Category folder not found',
        path: dir,
        baseDir: baseDir,
        category: category
      });
    }

    const files = await fs.readdir(dir);
    console.log('Files found:', files);

    if (files.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    const randomImage = files[Math.floor(Math.random() * files.length)];
    const imageUrl = `/${category}/images/${randomImage}`;

    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      stack: error.stack
    });
  }
}