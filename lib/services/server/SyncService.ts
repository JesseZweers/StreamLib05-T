import { XtreamCategoryService } from '@/lib/services/api/XtreamCategoryService'
import { XtreamChannelService } from '@/lib/services/api/XtreamChannelService'
import { CategoryService } from '@/lib/services/server/CategoryService'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { ServerRepository } from '@/lib/repositories/ServerRepository'
import type { XtreamCredentials } from '@/types'

export class SyncService {
  static async syncServerData(serverId: number, credentials: XtreamCredentials) {
    // Fetch data from Xtream API
    const [categories, channels] = await Promise.all([
      XtreamCategoryService.fetchCategories(
        credentials.url,
        credentials.username,
        credentials.password
      ),
      XtreamChannelService.fetchChannels(
        credentials.url,
        credentials.username,
        credentials.password
      )
    ])

    // Store in database
    await Promise.all([
      CategoryService.saveCategories(categories, serverId),
      ChannelService.saveChannels(channels, serverId)
    ])

    // Update server sync timestamp
    await ServerRepository.updateSyncTimestamp(serverId)

    return {
      success: true,
      categoriesCount: categories.length,
      channelsCount: channels.length
    }
  }
}