/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Inquiry = {
    id: string
    name: string
    whatsapp: string
    email: string | null
    subject: string
    message: string
    status: 'new' | 'in_progress' | 'resolved' | 'closed'
    admin_notes: string | null
    created_at: string
}

const STATUSES = ['new', 'in_progress', 'resolved', 'closed']
const STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-200 text-gray-600',
}

export default function ContactAdminPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState<string | null>(null)
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        console.log('[ContactAdmin] Mounted | Fetching inquiries')
        const fetchInquiries = async () => {
            const { data, error } = await supabase
                .from('contact_inquiries')
                .select('id, name, whatsapp, email, subject, message, status, admin_notes, created_at')
                .order('created_at', { ascending: false })

            if (error) console.error('[ContactAdmin] Fetch error:', error)
            else console.log(`[ContactAdmin] ✅ Loaded ${data?.length || 0} inquiries`)

            setInquiries(data || [])
            setLoading(false)
        }
        fetchInquiries()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(id)
        console.log(`[ContactAdmin] Updating inquiry ${id} → ${newStatus}`)
        try {
            const { error } = await supabase.from('contact_inquiries').update({ status: newStatus }).eq('id', id)
            if (error) throw error

            setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus as any } : i))
            console.log('[ContactAdmin] ✅ Status updated')
            setStatusMsg({ type: 'success', text: `Status: ${newStatus.replace('_', ' ')}` })
        } catch (err) {
            console.error('[ContactAdmin] ❌ Update failed:', err)
            setStatusMsg({ type: 'error', text: 'Failed to update status' })
        } finally {
            setUpdating(null)
            setTimeout(() => setStatusMsg(null), 3000)
        }
    }

    const handleExportCSV = () => {
        console.log('[ContactAdmin] CSV export triggered')
        const headers = ['ID', 'Name', 'WhatsApp', 'Email', 'Subject', 'Message', 'Status', 'Date']
        const rows = inquiries.map(i => [
            i.id, i.name, i.whatsapp, i.email || '', i.subject,
            `"${i.message.replace(/"/g, '""')}"`, i.status, new Date(i.created_at).toLocaleDateString()
        ])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contact_inquiries_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        console.log('[ContactAdmin] ✅ CSV downloaded')
    }

    const handleNotifyWA = (whatsapp: string, name: string, subject: string, status: string) => {
        const msg = `Hi ${name}, thank you for your inquiry regarding "${subject}". Your request status is now "${status.replace('_', ' ')}". Reply if you need anything else.`
        const link = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
        window.open(link, '_blank')
        console.log('[ContactAdmin] 📱 WhatsApp notify triggered')
    }

    const filtered = inquiries.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.whatsapp.includes(search) ||
        i.subject.toLowerCase().includes(search.toLowerCase()) ||
        i.message.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading inquiries...</div>

    return (
        <div className="space-y-6">
            {/* Status Toast */}
            {statusMsg && (
                <div className={`p-3 rounded-lg text-sm font-medium ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {statusMsg.text}
                </div>
            )}

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
                    <p className="text-sm text-gray-500">{inquiries.length} total messages</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search name, WA, subject..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition whitespace-nowrap">
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
                                <th className="p-4 font-medium">Name / Contact</th>
                                <th className="p-4 font-medium hidden md:table-cell">Subject & Message</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((i) => (
                                <tr key={i.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium">{i.name}</div>
                                        <div className="text-xs text-gray-500">{i.whatsapp}</div>
                                        {i.email && <div className="text-xs text-blue-500">{i.email}</div>}
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="text-xs font-semibold text-gray-700 mb-1">{i.subject}</div>
                                        <div className="truncate max-w-[300px] text-gray-600" title={i.message}>{i.message}</div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={i.status}
                                            onChange={(e) => handleStatusUpdate(i.id, e.target.value)}
                                            disabled={updating === i.id}
                                            className={`px-2 py-1 border rounded text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none ${STATUS_COLORS[i.status] || ''}`}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-500 whitespace-nowrap">{new Date(i.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleNotifyWA(i.whatsapp, i.name, i.subject, i.status)}
                                            className="text-[#25D366] hover:underline text-sm flex items-center gap-1"
                                        >
                                            💬 Notify
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No inquiries match your search</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}