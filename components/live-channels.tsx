// "use client"

// import { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'
// import { Card } from '@/components/ui/card'
// import { VideoPlayer } from '@/components/video-player'
// import { ChannelPreview } from '@/components/channel-preview'
// import { ChevronLeft, Loader2 } from 'lucide-react'
// import type { Category, Channel } from '@/types/xtream'
// import { CategoryService } from '@/lib/services/client/CategoryService'
// import { ChannelService } from '@/lib/services/client/ChannelService'
// import { StreamService } from '@/lib/services/client/StreamService'

// interface LiveChannelsProps {
//   initialServerId: number
// }

// export function LiveChannels({ initialServerId }: LiveChannelsProps) {
//   const searchParams = useSearchParams()
//   const [categories, setCategories] = useState<Category[]>([])
//   const [channels, setChannels] = useState<Channel[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
//   const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const categoriesData = await CategoryService.getCategories(initialServerId)
//         setCategories(categoriesData)
        
//         if (categoriesData.length > 0) {
//           setSelectedCategory(categoriesData[0])
//         }
//       } catch (error) {
//         console.error('Failed to load categories:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadCategories()
//   }, [initialServerId])

//   useEffect(() => {
//     if (!selectedCategory) return

//     const loadChannels = async () => {
//       setIsLoading(true)
//       try {
//         const channelsData = await ChannelService.getChannels(
//           initialServerId, 
//           selectedCategory.category_id
//         )
//         setChannels(channelsData)

//         const channelId = searchParams.get('channel')
//         if (channelId) {
//           const channel = channelsData.find(c => c.stream_id.toString() === channelId)
//           if (channel) {
//             setSelectedChannel(channel)
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load channels:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadChannels()
//   }, [initialServerId, selectedCategory, searchParams])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (selectedChannel) {
//     const credentials = localStorage.getItem('xtream_credentials')
//     if (!credentials) return null

//     const { url, username, password } = JSON.parse(credentials)
//     const streamUrl = StreamService.getStreamUrl(url, username, password, selectedChannel.stream_id)

//     return (
//       <div className="space-y-6">
//         <div>
//           <Link 
//             href="/live"
//             className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
//           >
//             <ChevronLeft className="mr-1 h-4 w-4" />
//             Back to {selectedCategory?.category_name || 'Categories'}
//           </Link>
//           <h1 className="text-3xl font-bold">{selectedChannel.name}</h1>
//         </div>

//         <VideoPlayer
//           key={selectedChannel.stream_id}
//           url={streamUrl}
//           title={selectedChannel.name}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-12 gap-6">
//       <div className="col-span-3">
//         <div className="sticky top-[4.5rem]">
//           <div className="font-semibold mb-2">Categories</div>
//           <div className="space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
//             {categories.map((category) => (
//               <button
//                 key={`category-${category.category_id}`}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   selectedCategory?.category_id === category.category_id
//                     ? 'bg-primary text-primary-foreground' 
//                     : 'hover:bg-accent'
//                 }`}
//                 onClick={() => {
//                   setSelectedCategory(category)
//                   setSelectedChannel(null)
//                 }}
//               >
//                 {category.category_name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="col-span-9">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {channels.map((channel) => (
//             <Card
//               key={`channel-${channel.stream_id}`}
//               className="p-4 cursor-pointer hover:bg-accent"
//               onClick={() => setSelectedChannel(channel)}
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className="font-medium">{channel.name}</h3>
//               </div>
//               <div className="mt-4">
//                 <ChannelPreview 
//                   logo={channel.stream_icon}
//                   name={channel.name}
//                 />
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VideoPlayer } from '@/components/video-player'
import { ChannelPreview } from '@/components/channel-preview'
import { ChevronLeft, Loader2 } from 'lucide-react'
import type { Category, Channel } from '@/types/xtream'
import { CategoryService } from '@/lib/services/client/CategoryService'
import { ChannelService } from '@/lib/services/client/ChannelService'
import { StreamService } from '@/lib/services/client/StreamService'

interface LiveChannelsProps {
  initialServerId: number
}

export function LiveChannels({ initialServerId }: LiveChannelsProps) {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingChannels, setIsLoadingChannels] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await CategoryService.getCategories(initialServerId)
        setCategories(categoriesData)
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [initialServerId])

  useEffect(() => {
    if (!selectedCategory) return

    const loadChannels = async () => {
      setIsLoadingChannels(true)
      try {
        const channelsData = await ChannelService.getChannels(
          initialServerId, 
          selectedCategory.category_id
        )
        setChannels(channelsData)

        const channelId = searchParams.get('channel')
        if (channelId) {
          const channel = channelsData.find(c => c.stream_id.toString() === channelId)
          if (channel) {
            setSelectedChannel(channel)
          }
        }
      } catch (error) {
        console.error('Failed to load channels:', error)
      } finally {
        setIsLoadingChannels(false)
      }
    }

    loadChannels()
  }, [initialServerId, selectedCategory, searchParams])

  if (isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (selectedChannel) {
    const credentials = localStorage.getItem('xtream_credentials')
    if (!credentials) return null

    const { url, username, password } = JSON.parse(credentials)
    const streamUrl = StreamService.getStreamUrl(url, username, password, selectedChannel.stream_id)

    return (
      <div className="space-y-6">
        <div>
          <Link 
            href="/live"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to {selectedCategory?.category_name || 'Categories'}
          </Link>
          <h1 className="text-3xl font-bold">{selectedChannel.name}</h1>
        </div>

        <VideoPlayer
          key={selectedChannel.stream_id}
          url={streamUrl}
          title={selectedChannel.name}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="sticky top-[4.5rem]">
          <div className="font-semibold mb-2">Categories</div>
          <ScrollArea className="h-[calc(100vh*3/4-6rem)] bg-card p-4">
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={`category-${category.category_id}`}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory?.category_id === category.category_id
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSelectedChannel(null)
                  }}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="col-span-9">
        {isLoadingChannels ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Loading channels...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <Card
                key={`channel-${channel.stream_id}`}
                className="p-4 cursor-pointer hover:bg-accent"
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{channel.name}</h3>
                </div>
                <div className="mt-4">
                  <ChannelPreview 
                    logo={channel.stream_icon}
                    name={channel.name}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}