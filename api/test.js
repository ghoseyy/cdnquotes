import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const baseDir = process.cwd();
    const publicDir = path.join(baseDir, 'public');
    
    const structure = {
      baseDir,
      exists: {
        public: await exists(publicDir),
        englishasset: await exists(path.join(publicDir, 'englishasset')),
        images: await exists(path.join(publicDir, 'englishasset', 'images'))
      },
      contents: {
        public: await safeReaddir(publicDir),
        englishasset: await safeReaddir(path.join(publicDir, 'englishasset')),
        images: await safeReaddir(path.join(publicDir, 'englishasset', 'images'))
      }
    };
    
    res.status(200).json(structure);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function safeReaddir(path) {
  try {
    return await fs.readdir(path);
  } catch {
    return null;
  }
}