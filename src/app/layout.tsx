// src/app/layout.tsx
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import PathAwareLayout from "@/components/layout/PathAwareLayout"
import SmoothScroll from "@/components/ui/SmoothScroll"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: 'Source & Imports by Dess | China to Africa Import Solutions',
  description: 'Kenya-rooted, China-based sourcing partner. Electronics, fashion, industrial equipment, household goods & more. Cost-friendly, WhatsApp-first.',
  keywords: ['import from china', 'kenya sourcing', 'china logistics', 'cargo consolidation', 'africa trade'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <SmoothScroll>
          <PathAwareLayout>
            {children}
          </PathAwareLayout>
        </SmoothScroll>
      </body>
    </html>
  )
}
