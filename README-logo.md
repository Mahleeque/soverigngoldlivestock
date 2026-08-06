Logo resize instructions

1. Place your source logo image anywhere in the repo, for example `scripts/logo-source.png`.
2. From the repo root, install `sharp` if you don't have it:

   ```bash
   cd frontend
   npm install sharp
   cd ..
   ```

3. Run the resize script:

   ```bash
   node scripts/resize-logo.js path/to/your/logo.png
   ```

   If you omit the path it will look for `scripts/logo-source.png`.

4. The script writes `frontend/public/images/logo.png` (300px wide, optimized PNG).

Notes:
- You can instead copy your pre-optimized `logo.png` directly to `frontend/public/images/`.
- After placing `logo.png`, restart the dev server (`npm run dev` in `frontend`) to see it.
