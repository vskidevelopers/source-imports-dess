'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

// Status mapping for UI & progress
const STATUS_CONFIG: Record<string, { label: string; progress: number; color: string; icon: string }> = {
    received: { label: 'Request Received', progress: 15, color: 'bg-gray-500', icon: '📥' },
    sourcing: { label: 'Sourcing Suppliers', progress: 35, color: 'bg-blue-500', icon: '🔍' },
    confirmed: { label: 'Quote Confirmed', progress: 55, color: 'bg-yellow-500', icon: '✅' },
    shipped: { label: 'Shipped from China', progress: 75, color: 'bg-orange-500', icon: '📦' },
    in_transit: { label: 'In Transit / Customs', progress: 90, color: 'bg-purple-500', icon: '🚢' },
    delivered: { label: 'Delivered', progress: 100, color: 'bg-green-500', icon: '🏠' },
    closed: { label: 'Closed', progress: 100, color: 'bg-gray-400', icon: '📋' },
}

type QuoteData = {
    quote_id: string
    category: string
    item_description: string
    quantity: number
    status: string
    created_at: string
}

export default function TrackerPage() {
    const [inputId, setInputId] = useState('')
    const [loading, setLoading] = useState(false)
    const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState(false)

    console.log('[TrackerPage] Mounted | Ready for tracking')

    const handleTrack = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setNotFound(false)
        setQuoteData(null)

        const trimmedId = inputId.trim().toUpperCase()
        if (!trimmedId.match(/^SID-\d{4}-\d{5}$/)) {
            console.warn('[TrackerPage] Invalid ID format:', trimmedId)
            setError('Please enter a valid Quote ID (e.g., SID-2026-00142)')
            return
        }

        setLoading(true)
        console.log('[TrackerPage] Fetching status for:', trimmedId)

        try {
            const { data, error: supabaseError } = await supabase
                .from('quotes')
                .select('quote_id, category, item_description, quantity, status, created_at')
                .eq('quote_id', trimmedId)
                .single()

            if (supabaseError) {
                if (supabaseError.code === 'PGRST116') {
                    console.log('[TrackerPage] Quote not found')
                    setNotFound(true)
                } else {
                    console.error('[TrackerPage] Supabase error:', supabaseError)
                    setError('Something went wrong. Please try again.')
                }
                return
            }

            console.log('[TrackerPage] Quote found:', data)
            setQuoteData(data as QuoteData)
        } catch (err) {
            console.error('[TrackerPage] Unexpected error:', err)
            setError('Network error. Check your connection.')
        } finally {
            setLoading(false)
        }
    }

    const statusInfo = quoteData ? STATUS_CONFIG[quoteData.status] || STATUS_CONFIG.received : null

    const waMessage = encodeURIComponent(
        `Hi, I'm checking the status of my quote: ${quoteData?.quote_id}. Status shows "${statusInfo?.label}". Please advise.`
    )
    const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${waMessage}`

    return (
        <main className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2">Track Your Quote</h1>
                <p className="text-center text-gray-600 mb-8">Enter your Quote ID to see real-time status. Need help? Chat on WhatsApp.</p>

                {/* ===== TRACKING FORM ===== */}
                <form onSubmit={handleTrack} className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <label className="block text-sm font-medium mb-2">Quote ID</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value.toUpperCase())}
                            placeholder="SID-2026-00001"
                            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase tracking-wider font-mono"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Checking...
                                </span>
                            ) : 'Track'}
                        </button>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-600">⚠️ {error}</p>}
                </form>

                {/* ===== NOT FOUND STATE ===== */}
                {notFound && (
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <p className="text-4xl mb-3">🔍</p>
                        <h2 className="text-xl font-semibold mb-2">Quote Not Found</h2>
                        <p className="text-gray-600 mb-4">Double-check your Quote ID or reach out to us directly.</p>
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition">
                            💬 Chat on WhatsApp
                        </a>
                    </div>
                )}

                {/* ===== SUCCESS / TRACKING STATE ===== */}
                {quoteData && statusInfo && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">{quoteData.quote_id}</span>
                            <span className="text-xs text-gray-500">{new Date(quoteData.created_at).toLocaleDateString()}</span>
                        </div>

                        <h2 className="text-lg font-semibold mb-1">{quoteData.item_description}</h2>
                        <p className="text-sm text-gray-500 mb-4">{quoteData.quantity}x • {quoteData.category}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{statusInfo.icon} {statusInfo.label}</span>
                                <span className="text-gray-500">{statusInfo.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full ${statusInfo.color} transition-all duration-700 ease-out`}
                                    style={{ width: `${statusInfo.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => console.log('[TrackerPage] WhatsApp track link clicked:', quoteData.quote_id)}
                            className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium rounded-lg transition"
                        >
                            💬 Continue Conversation on WhatsApp
                        </a>

                        <button
                            onClick={() => { setInputId(''); setQuoteData(null); setError(null); }}
                            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                            Track another quote
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}