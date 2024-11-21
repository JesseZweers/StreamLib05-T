export const TEST_CREDENTIALS = {
  username: 'vitoasc',
  password: '3585c59be3',
  url: 'http://cf.mar-cdn.me'
} as const

export const PROXY_URL = '/api/stream'

export const isDevelopment = process.env.NODE_ENV === 'development'

export const PLAYER_CONFIG = {
  ratio: '16:9',
  seekTime: 10,
  keyboard: {
    focused: true,
    global: true
  },
  tooltips: {
    controls: true,
    seek: true
  },
  captions: {
    active: true,
    language: 'auto'
  },
  quality: {
    default: 720,
    options: [2160, 1440, 1080, 720, 480, 360]
  },
  controls: [
    'play-large',
    'restart',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
  ]
}