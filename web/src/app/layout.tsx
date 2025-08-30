import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { HydrationBoundary } from '@/components/HydrationBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'RAG-Food | AI-Powered Food Discovery',
  description: 'Discover food, recipes, and culinary knowledge with AI-powered semantic search and intelligent answers.',
  keywords: ['food', 'recipes', 'AI', 'search', 'culinary', 'cooking'],
  authors: [{ name: 'RAG-Food Team' }],
  creator: 'RAG-Food',
  publisher: 'RAG-Food',
  openGraph: {
    title: 'RAG-Food | AI-Powered Food Discovery',
    description: 'Discover food, recipes, and culinary knowledge with AI-powered search.',
    url: 'https://ragfood.vercel.app',
    siteName: 'RAG-Food',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAG-Food | AI-Powered Food Discovery',
    description: 'Discover food, recipes, and culinary knowledge with AI-powered search.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                RAG-Food
              </span>
            </a>
            
            <div className="hidden md:flex gap-6">
              <a href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Chat
              </a>
              <a href="/dashboard" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Analytics
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✨ Online
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <HydrationBoundary>
          <Navigation />
          <div className="pt-20">
            {children}
          </div>
        </HydrationBoundary>
        <Analytics />
      </body>
    </html>
  )
}