const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const INPUT = path.join(__dirname, '../public/icons/logo.png')
const OUTPUT_DIR = path.join(__dirname, '../public/icons')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

async function main() {
  console.log('Генериране на иконки...\n')

  for (const size of sizes) {
    const output = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`)
    await sharp(INPUT)
      .resize(size, size, { fit: 'contain', background: { r: 13, g: 13, b: 26, alpha: 1 } })
      .png()
      .toFile(output)
    console.log(`✅ icon-${size}x${size}.png`)
  }

  // Apple touch icon
  await sharp(INPUT)
    .resize(180, 180, { fit: 'contain', background: { r: 13, g: 13, b: 26, alpha: 1 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'))
  console.log('✅ apple-touch-icon.png')

  // Favicon
  await sharp(INPUT)
    .resize(32, 32, { fit: 'contain', background: { r: 13, g: 13, b: 26, alpha: 1 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'))
  console.log('✅ favicon-32x32.png')

  console.log('\n🎉 Готово!')
}

main().catch(e => { console.error('❌', e); process.exit(1) })