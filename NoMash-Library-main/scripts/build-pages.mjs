import { build } from 'vite'
import { copyFile, writeFile } from 'node:fs/promises'

await build()
// GitHub Pages has no SPA rewrite rule. Its 404 document loads Vue Router
// at the original URL so direct visits to /WeatherCheck still render.
await copyFile('dist/index.html', 'dist/404.html')
await writeFile('dist/.nojekyll', '')
