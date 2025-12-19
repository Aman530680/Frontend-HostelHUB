const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://backend-hostelhub.onrender.com'

export async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  })

  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch (err) {
    throw new Error('Backend returned HTML instead of JSON')
  }

  if (!res.ok) {
    throw new Error(data.message || 'API error')
  }

  return data
}
