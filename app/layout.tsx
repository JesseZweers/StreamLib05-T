import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'
import { DatabaseService } from '@/lib/services/server/DatabaseService'
import { AuthProvider } from '@/providers/auth-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StreamLib',
  description: 'Your personal streaming library',
}

async function initDatabase() {
  try {
    await DatabaseService.initialize()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize database on app startup
  await initDatabase()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}