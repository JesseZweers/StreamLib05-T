import { BaseRepository } from './BaseRepository'
import { Channel } from '@/types/xtream'

export class ChannelRepository extends BaseRepository {
  static async getByCategory(serverId: number, categoryId?: string): Promise<Channel[]> {
    const baseQuery = `
      SELECT 
        stream_id, name, stream_type, stream_icon,
        epg_channel_id, category_id, tv_archive, tv_archive_duration,
        is_adult, custom_sid, direct_source
      FROM channels 
      WHERE server_id = ?
    `

    const params: any[] = [serverId]
    let finalQuery = baseQuery

    if (categoryId) {
      finalQuery += ' AND category_id = ?'
      params.push(categoryId)
    }

    finalQuery += ' ORDER BY name ASC'

    return await this.query<Channel[]>(finalQuery, params)
  }

  static async search(serverId: number, query: string): Promise<Channel[]> {
    return await this.query<Channel[]>(
      `SELECT 
        stream_id, name, stream_type, stream_icon,
        epg_channel_id, category_id, tv_archive, tv_archive_duration,
        is_adult, custom_sid, direct_source
      FROM channels 
      WHERE server_id = ? 
      AND name LIKE ?
      ORDER BY name ASC 
      LIMIT 20`,
      [serverId, `%${query}%`]
    )
  }

  static async saveBatch(channels: Channel[], serverId: number): Promise<void> {
    const BATCH_SIZE = 250
    for (let i = 0; i < channels.length; i += BATCH_SIZE) {
      const batch = channels.slice(i, i + BATCH_SIZE)
      const placeholders = batch.map(() => 
        '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?, ?)'
      ).join(',')
      
      const values = batch.flatMap(channel => [
        serverId,
        channel.stream_id,
        channel.num || null,
        channel.name.replace(/['"]/g, ''),
        channel.stream_type,
        channel.stream_icon || '',
        channel.epg_channel_id || '',
        channel.category_id,
        channel.tv_archive ? 1 : 0,
        channel.tv_archive_duration || 0,
        channel.added,
        channel.is_adult ? 1 : 0,
        channel.custom_sid || null,
        channel.direct_source || ''
      ])

      await this.query(
        `INSERT INTO channels (
          server_id, stream_id, num, name, stream_type, stream_icon,
          epg_channel_id, category_id, tv_archive, tv_archive_duration,
          added, is_adult, custom_sid, direct_source
        )
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          num = VALUES(num),
          name = VALUES(name),
          stream_type = VALUES(stream_type),
          stream_icon = VALUES(stream_icon),
          epg_channel_id = VALUES(epg_channel_id),
          category_id = VALUES(category_id),
          tv_archive = VALUES(tv_archive),
          tv_archive_duration = VALUES(tv_archive_duration),
          added = VALUES(added),
          is_adult = VALUES(is_adult),
          custom_sid = VALUES(custom_sid),
          direct_source = VALUES(direct_source)`,
        values
      )
    }
  }
}