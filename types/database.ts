export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

export interface ServerInfo {
  id: number;
  url: string;
  categoryCount: number;
  channelCount: number;
  lastSync?: Date;
}

export interface StoredCredentials {
  id: number;
  serverId: number;
  username: string;
  password: string;
}