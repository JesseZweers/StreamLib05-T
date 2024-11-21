export interface XtreamCredentials {
  username: string;
  password: string;
  url: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number | null;
}

export interface Channel {
  num: number;
  stream_id: number;
  name: string;
  stream_type: string;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  is_adult: number;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface ServerInfo {
  url: string;
  port: string;
  https_port: string;
  server_protocol: string;
  rtmp_port: string;
  timezone: string;
  timestamp_now: number;
  time_now: string;
}

export interface AuthResponse {
  user_info: {
    username: string;
    password: string;
    message: string;
    auth: number;
    status: string;
    exp_date: string;
    is_trial: string;
    active_cons: string;
    created_at: string;
    max_connections: string;
    allowed_output_formats: string[];
  };
  server_info: ServerInfo;
}