"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { XtreamCategoryService } from '@/lib/services/api/XtreamCategoryService'
import { XtreamChannelService } from '@/lib/services/api/XtreamChannelService'
import { CategoryService } from '@/lib/services/client/CategoryService'
import { ChannelService } from '@/lib/services/client/ChannelService'

interface Task {
  id: string
  name: string
  status: 'pending' | 'loading' | 'completed' | 'error'
  count?: number
  error?: string
}

export function FirstTimeSetup() {
  const router = useRouter()
  const { serverId } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'categories', name: 'Loading categories', status: 'pending' },
    { id: 'channels', name: 'Loading channels', status: 'pending' }
  ])
  const [isComplete, setIsComplete] = useState(false)

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(current =>
      current.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    )
  }

  useEffect(() => {
    const initializeData = async () => {
      if (!serverId) {
        router.push('/')
        return
      }

      const credentials = localStorage.getItem('xtream_credentials')
      if (!credentials) {
        router.push('/')
        return
      }

      const { username, password, url } = JSON.parse(credentials)

      try {
        // Load Categories
        updateTask('categories', { status: 'loading' })
        const categories = await XtreamCategoryService.fetchCategories(url, username, password)
        await CategoryService.saveCategories(serverId, categories)
        updateTask('categories', { 
          status: 'completed',
          count: categories.length
        })

        // Load Channels
        updateTask('channels', { status: 'loading' })
        const channels = await XtreamChannelService.fetchChannels(url, username, password)
        await ChannelService.saveChannels(serverId, channels)
        updateTask('channels', { 
          status: 'completed',
          count: channels.length
        })

        setIsComplete(true)
      } catch (error) {
        console.error('Setup failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize'
        
        // Mark current task as failed
        const currentTask = tasks.find(t => t.status === 'loading')
        if (currentTask) {
          updateTask(currentTask.id, { 
            status: 'error',
            error: errorMessage
          })
        }
      }
    }

    initializeData()
  }, [serverId, router, tasks])

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Setting Up Your Library</h2>
        <p className="text-muted-foreground">
          Please wait while we load your content
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="flex items-center gap-3 p-4 rounded-lg border bg-card"
          >
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <p className="font-medium">
                {task.name}
                {task.count !== undefined && task.status === 'completed' && (
                  <span className="text-muted-foreground ml-1">
                    ({task.count})
                  </span>
                )}
              </p>
              {task.error && (
                <p className="text-sm text-destructive mt-1">{task.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="flex justify-center mt-8">
          <Button 
            size="lg"
            onClick={() => router.push('/live')}
          >
            Go to Live TV
          </Button>
        </div>
      )}
    </div>
  )
}