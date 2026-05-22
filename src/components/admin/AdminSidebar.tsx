'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: '📊', href: '/admin' },
    { label: 'Quotes', icon: '📋', href: '/admin/quotes' },
    { label: 'Contact', icon: '📩', href: '/admin/contact' },
    { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        console.log('[AdminSidebar] Logout triggered')
        await supabase.auth.signOut()
        router.replace('/admin/login')
    }

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full hidden md:flex">
            <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800">Admin Panel</h2>
                <p className="text-xs text-gray-500">Source & Imports by Dess</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        onClick={() => console.log(`[AdminSidebar] Navigating to ${item.href}`)}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <span className="text-lg">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    )
}