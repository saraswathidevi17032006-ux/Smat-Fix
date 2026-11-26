// Base URL for the Smart Fix backend API.
// Uses VITE_API_URL from frontend/.env, or falls back to the Vite proxy (/api).
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

/**
 * Helper function to make authenticated or public JSON requests to the backend.
 * Automatically attaches stored JWT token for protected routes.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const token = sessionStorage.getItem('smartfix_token') || localStorage.getItem('smartfix_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  let response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      'Unable to connect to the Smart Fix server. Please try again in a moment.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`)
  }

  return data
}

/**
 * Check backend health status (GET /api/health).
 */
export function checkHealth() {
  return apiRequest('/api/health')
}

/**
 * Register a new user (POST /api/auth/register).
 */
export function registerUser({ name, email, phone, password, confirmPassword, role }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password, confirmPassword, role }),
  })
}

/**
 * Authenticate an existing user (POST /api/auth/login).
 */
export function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Fetch the currently authenticated user's profile (GET /api/auth/me).
 * Requires a valid JWT stored in localStorage or sessionStorage.
 */
export function getCurrentUser() {
  return apiRequest('/api/auth/me')
}

/**
 * Save auth token and user data to storage.
 * Uses localStorage for "remember me" or sessionStorage for session-only.
 */
export function saveAuthData(token, user, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('smartfix_token', token)
  storage.setItem('smartfix_user', JSON.stringify(user))
}

/**
 * Load the saved user from storage (localStorage first, then sessionStorage).
 */
export function loadSavedUser() {
  try {
    const raw = localStorage.getItem('smartfix_user') || sessionStorage.getItem('smartfix_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Load the saved JWT token from storage.
 */
export function loadSavedToken() {
  return localStorage.getItem('smartfix_token') || sessionStorage.getItem('smartfix_token') || null
}

/**
 * Clear all auth data from both storages (logout).
 */
export function clearAuthData() {
  localStorage.removeItem('smartfix_token')
  localStorage.removeItem('smartfix_user')
  sessionStorage.removeItem('smartfix_token')
  sessionStorage.removeItem('smartfix_user')
}
