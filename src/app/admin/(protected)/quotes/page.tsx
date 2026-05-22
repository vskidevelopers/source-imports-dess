// src/app/admin/(protected)/quotes/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Quote = {
    id: string
    quote_id: string
    customer_name: string
    whatsapp: string
    category: string
    item_description: string
    quantity: number
    status: string
    created_at: string
}

const STATUSES = ['received', 'sourcing', 'confirmed', 'shipped', 'in_transit', 'delivered', 'closed'] as const
type QuoteStatus = (typeof STATUSES)[number]

const STATUS_COLORS: Record<QuoteStatus, string> = {
    received: 'bg-gray-100 text-gray-700',
    sourcing: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-orange-100 text-orange-700',
    in_transit: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    closed: 'bg-gray-200 text-gray-600',
}

export default function QuotesAdminPage() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const { data, error } = await supabase
                    .from('quotes')
                    .select('id, quote_id, customer_name, whatsapp, category, item_description, quantity, status, created_at')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setQuotes(data || [])
            } catch (err) {
                console.error('[QuotesAdmin] Fetch error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchQuotes()
    }, [])

    const handleStatusUpdate = async (quoteId: string, newStatus: QuoteStatus) => {
        setUpdating(quoteId)
        try {
            const { error } = await supabase
                .from('quotes')
                .update({ status: newStatus })
                .eq('quote_id', quoteId)

            if (error) throw error

            setQuotes(prev => prev.map(q =>
                q.quote_id === quoteId ? { ...q, status: newStatus } : q
            ))
        } catch (err) {
            console.error('[QuotesAdmin] Update error:', err)
            alert('Failed to update status')
        } finally {
            setUpdating(null)
        }
    }

    const handleExportCSV = () => {
        const headers = ['Quote ID', 'Name', 'WhatsApp', 'Category', 'Item', 'Qty', 'Status', 'Date']
        const rows = quotes.map(q => [
            q.quote_id,
            q.customer_name,
            q.whatsapp,
            q.category,
            `"${q.item_description.replace(/"/g, '""')}"`,
            q.quantity,
            q.status,
            new Date(q.created_at).toLocaleDateString()
        ])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quotes_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const filtered = quotes.filter(q =>
        q.quote_id.toLowerCase().includes(search.toLowerCase()) ||
        q.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        q.whatsapp.includes(search) ||
        q.category.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading quotes...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
                    <p className="text-sm text-gray-500">{quotes.length} total requests</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search ID, name, WA, or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition whitespace-nowrap"
                    >
                        📥 Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-medium">Quote ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium hidden md:table-cell">Item / Qty</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((q) => (
                                <tr key={q.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-mono text-blue-600">{q.quote_id}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{q.customer_name}</div>
                                        <div className="text-xs text-gray-500">{q.whatsapp}</div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="truncate max-w-[200px]" title={q.item_description}>
                                            {q.item_description}
                                        </div>
                                        <div className="text-xs text-gray-500">{q.quantity}x • {q.category}</div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={q.status}
                                            onChange={(e) => handleStatusUpdate(q.quote_id, e.target.value as QuoteStatus)}
                                            disabled={updating === q.quote_id}
                                            className={`px-2 py-1 border rounded text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none ${STATUS_COLORS[q.status as QuoteStatus] || ''}`}
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-500 whitespace-nowrap">
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => router.push(`/admin/quotes/${q.quote_id}`)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No quotes match your search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}