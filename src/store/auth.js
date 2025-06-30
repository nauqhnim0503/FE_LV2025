// src/store/auth.js

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function saveUserSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const data = localStorage.getItem(USER_KEY)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Lỗi khi parse user từ localStorage:', error)
    return null
  }
}

export function clearUserSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
