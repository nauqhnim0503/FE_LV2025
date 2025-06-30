const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

export function saveAdminSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminUser() {
  const data = localStorage.getItem(USER_KEY)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Lỗi khi parse admin user từ localStorage:', error)
    return null
  }
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
