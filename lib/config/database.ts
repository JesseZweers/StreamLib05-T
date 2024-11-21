export const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:uDEmpFZZJwpWfUtMvpGRSnjMkUqusvXL@autorack.proxy.rlwy.net:38080/railway'

// Parse database URL into config object
function parseDatabaseUrl(url: string) {
  const dbUrl = new URL(url)
  return {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '3306'),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  } as const
}

export const DATABASE_CONFIG = parseDatabaseUrl(DATABASE_URL)