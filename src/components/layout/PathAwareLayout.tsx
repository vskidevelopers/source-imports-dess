// src/components/layout/PathAwareLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp'

export default function PathAwareLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Hide Navbar + Floating WA on all admin routes
    const isAdminRoute = pathname?.startsWith('/admin')

    console.log('[PathAwareLayout] Current path:', pathname, '| isAdmin:', isAdminRoute)

    return (
        <>
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <FloatingWhatsApp />}
        </>
    )
}