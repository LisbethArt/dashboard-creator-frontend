import { readFile, mkdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function curl(url, outPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'curl.exe',
      ['-fsSL', url, '-o', outPath],
      { stdio: 'inherit' }
    )
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`curl exited ${code}`))
    })
  })
}

const manifest = JSON.parse(
  await readFile(join(__dirname, 'stitch-manifest.json'), 'utf8')
)

await mkdir(join(root, 'src/assets/stitch/screens'), { recursive: true })
await mkdir(join(root, 'public/stitch-html'), { recursive: true })

await curl(manifest.thumbnailUrl, join(root, 'src/assets/stitch/project-thumbnail.png'))

for (const s of manifest.screens) {
  await curl(s.screenshotUrl, join(root, 'src/assets/stitch/screens', `${s.slug}.png`))
  await curl(s.htmlUrl, join(root, 'public/stitch-html', `${s.slug}.html`))
}
