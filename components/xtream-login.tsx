"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { TEST_CREDENTIALS, isDevelopment } from '@/lib/config/config'
import { Link2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function XtreamLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await login(credentials)
      toast({
        title: "Success",
        description: "Successfully connected to the server",
      })
      
      // Redirect based on setup status
      if (result.needsSetup) {
        router.push('/setup')
      } else {
        router.push('/live')
      }
      
      setShowLogin(false)
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Login failed',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestCredentials = () => {
    setCredentials(TEST_CREDENTIALS)
  }

  return (
    <>
      <Button size="lg" onClick={() => setShowLogin(true)}>
        <Link2 className="mr-2 h-4 w-4" />
        Connect
      </Button>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect to Xtream Service</DialogTitle>
            <DialogDescription>
              Enter your Xtream credentials to access live TV channels.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Server URL</Label>
              <Input
                id="url"
                placeholder="http://example.com:port"
                value={credentials.url}
                onChange={(e) => setCredentials(prev => ({ ...prev, url: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {isDevelopment && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTestCredentials}
                  disabled={isLoading}
                >
                  Use Test Credentials
                </Button>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLogin(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}