export const ALLOWED_HOSTS = [
  'cf.mar-cdn.me',
  '185.245.1.8',
  '185.245.1.11', 
  '185.245.1.14',
  '185.245.1.101',
  '185.245.1.104'
] as const

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*'
} as const

export const API_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 // 30 days
} as const

export const isDevelopment = process.env.NODE_ENV === 'development'