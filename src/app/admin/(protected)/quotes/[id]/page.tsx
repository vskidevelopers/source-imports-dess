'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type QuoteDetail = {
    quote_id: string
    customer_name: string
    whatsapp: string
    email: string | null
    category: string
    item_description: string
    quantity: number
    destination_country: string
    estimated_budget: number | null
    urgency: string
    status: string
    admin_notes: string
    files: string[] | null
    created_at: string
}

const STATUSES = [
    { value: 'received', label: '📥 Received', color: 'bg-gray-100 text-gray-700' },
    { value: 'sourcing', label: '🔍 Sourcing', color: 'bg-blue-100 text-blue-700' },
    { value: 'confirmed', label: '✅ Confirmed', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'shipped', label: '📦 Shipped', color: 'bg-orange-100 text-orange-700' },
    { value: 'in_transit', label: '🚢 In Transit', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: '🏠 Delivered', color: 'bg-green-100 text-green-700' },
    { value: 'closed', label: '📋 Closed', color: 'bg-gray-200 text-gray-600' },
]

export default function QuoteDetailPage() {
    const params = useParams()
    const router = useRouter()
    const quoteId = params.id as string

    const [quote, setQuote] = useState<QuoteDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState('')
    const [savingNotes, setSavingNotes] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        console.log(`[QuoteDetail] Mounted | Fetching ${quoteId}`)
        const fetchQuote = async () => {
            const { data, error } = await supabase
                .from('quotes')
                .select('*')
                .eq('quote_id', quoteId)
                .single()

            if (error || !data) {
                console.error('[QuoteDetail] ❌ Fetch failed:', error)
                router.replace('/admin')
                return
            }

            console.log('[QuoteDetail] ✅ Quote loaded')
            setQuote(data as QuoteDetail)
            setNotes(data.admin_notes || '')
            setLoading(false)
        }
        fetchQuote()
    }, [quoteId, router])

    const handleSaveNotes = async () => {
        if (!quote) return
        setSavingNotes(true)
        console.log(`[QuoteDetail] Saving notes for ${quoteId}`)
        try {
            const { error } = await supabase.from('quotes').update({ admin_notes: notes }).eq('quote_id', quoteId)
            if (error) throw error
            console.log('[QuoteDetail] ✅ Notes saved')
            setStatusMsg({ type: 'success', text: 'Notes updated' })
            setTimeout(() => setStatusMsg(null), 3000)
        } catch (err) {
            console.error('[QuoteDetail] ❌ Save failed:', err)
            setStatusMsg({ type: 'error', text: 'Failed to save notes' })
        } finally {
            setSavingNotes(false)
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        if (!quote || updatingStatus) return
        setUpdatingStatus(true)
        console.log(`[QuoteDetail] Updating status: ${quote.status} → ${newStatus}`)

        try {
            const { error } = await supabase
                .from('quotes')
                .update({ status: newStatus })
                .eq('quote_id', quoteId)

            if (error) throw error

            // Optimistic UI update
            setQuote(prev => prev ? { ...prev, status: newStatus } : null)
            console.log('[QuoteDetail] ✅ Status updated')
            setStatusMsg({ type: 'success', text: `Status: ${newStatus.replace('_', ' ')}` })

            // Optional: auto-open WA to notify client
            const confirmNotify = window.confirm('Status updated. Notify customer on WhatsApp?')
            if (confirmNotify) {
                const msg = `Hi ${quote.customer_name}, your quote ${quoteId} status is now "${newStatus.replace('_', ' ')}". ${notes ? `Note: ${notes}` : ''} Reply if you have questions.`
                const link = `https://wa.me/${quote.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
                window.open(link, '_blank')
            }
        } catch (err) {
            console.error('[QuoteDetail] ❌ Status update failed:', err)
            setStatusMsg({ type: 'error', text: 'Failed to update status' })
        } finally {
            setUpdatingStatus(false)
            setTimeout(() => setStatusMsg(null), 3000)
        }
    }

    const handleNotifyWA = () => {
        const msg = `Hi ${quote?.customer_name}, your quote ${quoteId} status is "${quote?.status.replace('_', ' ')}". ${quote?.admin_notes ? `Note: ${quote.admin_notes}` : ''} Reply if you have questions.`
        const link = `https://wa.me/${quote?.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
        window.open(link, '_blank')
        console.log('[QuoteDetail] 📱 WhatsApp notification triggered')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading quote...</div>
    if (!quote) return <div className="min-h-screen flex items-center justify-center text-red-500">Quote not found</div>

    const currentStatus = STATUSES.find(s => s.value === quote.status)

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                ← Back to Dashboard
            </button>

            {/* Status Update Banner */}
            {statusMsg && (
                <div className={`p-3 rounded-lg text-sm font-medium ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {statusMsg.text}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{quote.quote_id}</h1>
                        <p className="text-sm text-gray-500">{new Date(quote.created_at).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Status:</span>
                            <select
                                value={quote.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                disabled={updatingStatus}
                                className={`px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none ${currentStatus?.color || ''}`}
                            >
                                {STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleNotifyWA}
                            className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition text-sm flex items-center gap-1"
                        >
                            💬 Notify WA
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                        <h2 className="font-semibold text-gray-700">Customer Details</h2>
                        <p><span className="text-gray-500">Name:</span> {quote.customer_name}</p>
                        <p><span className="text-gray-500">WhatsApp:</span> {quote.whatsapp}</p>
                        <p><span className="text-gray-500">Email:</span> {quote.email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="font-semibold text-gray-700">Request Details</h2>
                        <p><span className="text-gray-500">Category:</span> {quote.category}</p>
                        <p><span className="text-gray-500">Item:</span> {quote.item_description}</p>
                        <p><span className="text-gray-500">Quantity:</span> {quote.quantity}x</p>
                        <p><span className="text-gray-500">Destination:</span> {quote.destination_country}</p>
                        <p><span className="text-gray-500">Budget:</span> {quote.estimated_budget ? `$${quote.estimated_budget}` : 'N/A'}</p>
                        <p><span className="text-gray-500">Urgency:</span> {quote.urgency}</p>
                    </div>
                </div>

                {quote.files && quote.files.length > 0 && (
                    <div className="mb-6">
                        <h2 className="font-semibold text-gray-700 mb-2">Attached Files</h2>
                        <div className="flex flex-wrap gap-3">
                            {quote.files.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition">
                                    📎 File {i + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <label className="block font-semibold text-gray-700 mb-2">Admin Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                        placeholder="Internal notes for team tracking..."
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-60"
                        >
                            {savingNotes ? 'Saving...' : 'Save Notes'}
                        </button>
                        <button
                            onClick={() => { setNotes(''); setStatusMsg({ type: 'success', text: 'Notes cleared' }); }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}