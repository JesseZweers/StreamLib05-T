"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import type { Channel } from '@/types/xtream'
import { ChannelService } from '@/lib/services/client/ChannelService'

interface SearchProps {
  serverId: number
}

export function Search({ serverId }: SearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    const searchChannels = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setChannels([])
        return
      }

      setIsLoading(true)
      try {
        const results = await ChannelService.searchChannels(serverId, debouncedQuery)
        setChannels(results)
      } catch (error) {
        console.error('Failed to search channels:', error)
      } finally {
        setIsLoading(false)
      }
    }

    searchChannels()
  }, [debouncedQuery, serverId])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search channels...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search channels</DialogTitle>
        <CommandInput
          placeholder="Type at least 2 characters to search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              query.length < 2 ? 'Type at least 2 characters to search...' : 'No results found.'
            )}
          </CommandEmpty>
          {channels.length > 0 && (
            <CommandGroup heading="Channels">
              {channels.map((channel) => (
                <CommandItem
                  key={channel.stream_id}
                  value={channel.name}
                  onSelect={() => {
                    router.push(`/live?channel=${channel.stream_id}`)
                    setOpen(false)
                  }}
                >
                  <span>{channel.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}