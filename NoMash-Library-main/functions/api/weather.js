const allowedOrigin = 'https://ejiayid-dot.github.io'

export async function onRequest({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Vary': 'Origin' }
  if (request.headers.get('Origin') === allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
  }
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })
  if (request.method !== 'GET') return reply({ message: 'Method not allowed.' }, 405)
  if (!env.OPENWEATHER_API_KEY) return reply({ message: 'Weather service is not configured.' }, 503)

  const input = new URL(request.url).searchParams
  const city = input.get('city')?.trim()
  let lat = input.get('lat')
  let lon = input.get('lon')
  if (city ? city.length > 120 :
    lat === null || lon === null || lat.trim() === '' || lon.trim() === '' ||
    !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon)) ||
    Math.abs(Number(lat)) > 90 || Math.abs(Number(lon)) > 180) {
    return reply({ message: 'Enter a valid city or coordinates.' }, 400)
  }

  const get = async (path, params) => {
    const url = new URL(path, 'https://api.openweathermap.org')
    url.search = new URLSearchParams({ ...params, appid: env.OPENWEATHER_API_KEY })
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      cf: { cacheTtl: 300, cacheEverything: true }
    })
    if (!response.ok) throw new Error('Weather provider failed.')
    return response.json()
  }

  try {
    let name
    if (city) {
      const locations = await get('/geo/1.0/direct', { q: city, limit: '1' })
      if (!locations.length) return reply({ message: 'City not found.' }, 404)
      ;({ lat, lon, name } = locations[0])
    }
    const weather = await get('/data/2.5/weather', { lat, lon, units: 'metric' })
    if (name) weather.name = name
    // Coordinate requests may describe a user's location: do not cache this
    // endpoint's response in a shared cache. Upstream data is cached separately.
    headers['Cache-Control'] = 'no-store'
    return reply(weather)
  } catch {
    return reply({ message: 'Weather is temporarily unavailable. Please try again.' }, 502)
  }
}
