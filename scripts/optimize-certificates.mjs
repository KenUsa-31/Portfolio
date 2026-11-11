import { readdir, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const TARGETS = [
  { folder: 'certificate', maxWidth: 1200 },
  { folder: 'projects', maxWidth: 1200 },
]
const WEBP_QUALITY = 80

await mkdir(join(process.cwd(), 'public', 'optimized'), { recursive: true })
await sharp(join(process.cwd(), 'public', 'ken.jpg'))
  .resize(520, 520, { fit: 'cover' })
  .webp({ quality: 82 })
  .toFile(join(process.cwd(), 'public', 'optimized', 'ken.webp'))

console.log('ken.jpg'.padEnd(62) + ' -> ken.webp (520x520)')

for (const { folder, maxWidth } of TARGETS) {
  const SRC = join(process.cwd(), 'public', folder)
  const OUT = join(process.cwd(), 'public', folder, 'optimized')

  await mkdir(OUT, { recursive: true })

  const files = (await readdir(SRC)).filter(f =>
    /\.(png|jpe?g)$/i.test(f) && !f.startsWith('optimized')
  )

  for (const f of files) {
    const base = f.replace(/\.(png|jpe?g)$/i, '')
    const safe = base.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()
    const srcPath = join(SRC, f)

    const meta = await sharp(srcPath).metadata()
    const scale = Math.min(1, maxWidth / meta.width)
    const outW = Math.round(meta.width * scale)
    const outH = Math.round(meta.height * scale)

    await sharp(srcPath)
      .resize(outW, outH, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(join(OUT, `${safe}.webp`))

    await sharp(srcPath)
      .resize(outW, outH, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(OUT, `${safe}.jpg`))

    const origKB = (await sharp(srcPath).toBuffer()).length / 1024
    const webpKB = (await sharp(join(OUT, `${safe}.webp`)).toBuffer()).length / 1024
    const jpgKB = (await sharp(join(OUT, `${safe}.jpg`)).toBuffer()).length / 1024

    console.log(
      `${f.padEnd(62)} ${origKB.toFixed(0).padStart(6)}KB -> ${webpKB.toFixed(0).padStart(5)}KB webp / ${jpgKB.toFixed(0).padStart(5)}KB jpg (${outW}x${outH})`
    )
  }
}
