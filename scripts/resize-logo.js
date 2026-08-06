// Resize and optimize a source logo into frontend/public/images/logo.png
// Usage:
//   node scripts/resize-logo.js <source-file>
// If no source-file is provided, it will look for ./scripts/logo-source.png

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const src = process.argv[2] || path.join(__dirname, 'logo-source.png')
const outDir = path.join(__dirname, '..', 'frontend', 'public', 'images')
const outPath = path.join(outDir, 'logo.png')

if (!fs.existsSync(src)) {
  console.error('Source image not found:', src)
  process.exit(2)
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

sharp(src)
  .resize({ width: 300 })
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(outPath)
  .then(() => console.log('Wrote', outPath))
  .catch((err) => { console.error(err); process.exit(1) })
