#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = process.argv[2] || path.join(process.cwd(), 'App icon.png');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(src)) {
  console.error('Source not found:', src);
  process.exit(1);
}
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

(async () => {
  try {
    // create a solid orange background 512x512 and composite the logo centered at 320x320
    const logo = await sharp(src).resize(320, 320, { fit: 'contain' }).png().toBuffer();

    const bg = sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: '#ff7a00'
      }
    });

    await bg.composite([{ input: logo, gravity: 'centre' }]).png().toFile(path.join(publicDir, 'maskable-icon-512.png'));
    console.log('✅ maskable-icon-512.png created');

    // create 192 icon similarly (smaller logo)
    const logo192 = await sharp(src).resize(160, 160, { fit: 'contain' }).png().toBuffer();
    const bg192 = sharp({ create: { width: 192, height: 192, channels: 4, background: '#ff7a00' } });
    await bg192.composite([{ input: logo192, gravity: 'centre' }]).png().toFile(path.join(publicDir, 'app-icon-192.png'));
    console.log('✅ app-icon-192.png created/updated');

    // create favicon 32x32
    const logo32 = await sharp(src).resize(32, 32, { fit: 'contain' }).png().toBuffer();
    const bg32 = sharp({ create: { width: 32, height: 32, channels: 4, background: '#ff7a00' } });
    await bg32.composite([{ input: logo32, gravity: 'centre' }]).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
    await bg32.composite([{ input: logo32, gravity: 'centre' }]).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✅ favicon-32x32.png and favicon-16x16.png created/updated');

    console.log('\nAll Android-friendly icons created in public/. Commit and push the files to update the site.');
  } catch (err) {
    console.error('Error creating icons:', err);
    process.exit(1);
  }
})();
