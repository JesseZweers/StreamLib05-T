"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Link2, Loader2 } from 'lucide-react'
import { XtreamLogin } from '@/components/xtream-login'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/live')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Welcome to StreamLib
      </h1>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto">
        Your personal streaming library for all your favorite content
      </p>
      <div className="flex gap-4">
        <Button size="lg" onClick={() => setShowLogin(true)}>
          <Link2 className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </div>
      <XtreamLogin open={showLogin} onOpenChange={setShowLogin} />
    </div>
  )
}