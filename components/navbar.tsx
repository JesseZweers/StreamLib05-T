"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Search } from '@/components/search'
import { Button } from '@/components/ui/button'
import { Tv, LogOut, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, serverId, logout, checkAuthStatus, isLoading } = useAuth()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isLiveTvActive = pathname === '/live' || pathname.startsWith('/live?')

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-2 flex h-14 items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="font-bold">StreamLib</span>
          </div>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-2 flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">StreamLib</span>
          </Link>
          {isAuthenticated && (
            <Link 
              href="/live"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:bg-accent rounded-md px-3 py-2",
                isLiveTvActive && "bg-accent"
              )}
            >
              <Tv className="mr-2 h-4 w-4" />
              Live TV
            </Link>
          )}
        </div>
        <div className="flex-1 flex justify-center max-w-sm mx-4">
          {isAuthenticated && serverId && <Search serverId={serverId} />}
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}