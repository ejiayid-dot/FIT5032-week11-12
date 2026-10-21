# FIT5032 Weeks 11 and 12

Vue Library deployment exercises.

- Cloudflare Git deployment: https://yj-library-git.pages.dev/
- GitHub Pages: https://ejiayid-dot.github.io/FIT5032-week11-12/
- Weather: /WeatherCheck (OpenWeather via a Cloudflare Pages Function).

## Build

From `NoMash-Library-main`, run `npm ci` then `npm run build`. For GitHub Pages set `VITE_BASE_PATH=/FIT5032-week11-12/` and `VITE_WEATHER_API_BASE=https://yj-library-git.pages.dev`, then run `npm run build:pages`.

The workflow builds and publishes `dist` to `gh-pages` after every push to `main`. Configure GitHub Settings > Pages to publish the `gh-pages` branch from its root.

## Cloudflare

Use project root `NoMash-Library-main`, build command `npm run build`, and output directory `dist`. Add `OPENWEATHER_API_KEY` as an encrypted runtime Secret. Never set the key as a VITE variable in a public build.

This repository excludes local environment values and personal Firebase role identifiers. The original course Firebase screens require a separate environment configuration; the hosting evidence uses the public home and weather pages.
