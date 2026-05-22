/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    console.log('[AdminLoginPage] Mounted | Ready for auth')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        console.log('[AdminLoginPage] Login attempt:', email)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error

            console.log('[AdminLoginPage] ✅ Auth successful | Redirecting to /admin')
            router.replace('/admin') // Use replace to prevent back-button loop
        } catch (err: any) {
            console.error('[AdminLoginPage] ❌ Auth failed:', err.message)
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                    <p className="text-sm text-gray-500 mt-1">Source & Imports by Dess</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">⚠️ {error}</p>}

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </main>
    )
}