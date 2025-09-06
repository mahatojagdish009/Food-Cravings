import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { HydrationBoundary } from '@/components/HydrationBoundary'
import type { Metadata } from 'next'

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

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

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
          <div className="pt-20">
            {children}
          </div>
        </HydrationBoundary>
        <Analytics />
      </body>
    </html>
  )
}