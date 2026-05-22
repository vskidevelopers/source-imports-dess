'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        console.log('[AdminProtectedLayout] Mounted | Checking session...')
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                console.log('[AdminProtectedLayout] ❌ No session | Redirecting to /admin/login')
                router.replace('/admin/login')
            } else {
                console.log('[AdminProtectedLayout] ✅ Session valid | Rendering dashboard')
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [router, pathname])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Verifying access...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}