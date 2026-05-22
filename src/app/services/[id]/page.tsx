/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ServiceQuoteForm } from '@/components/quote/ServiceQuoteForm'

// Re-use the same data for consistency
const SERVICES = [
    { id: 'sourcing', title: 'Product Sourcing', desc: 'Factory verification, sample requests, and price negotiation directly from Chinese suppliers.', icon: '🔍', color: 'from-blue-500 to-cyan-400' },
    { id: 'consolidation', title: 'Cargo Consolidation', desc: 'Merge multiple orders into one shipment. Optimize container space and slash freight costs.', icon: '📦', color: 'from-purple-500 to-pink-400' },
    { id: 'shipping', title: 'Shipping & Logistics', desc: 'Ocean, air, or rail freight. Export documentation, customs clearance, and last-mile delivery.', icon: '🚢', color: 'from-indigo-500 to-violet-400' },
    { id: 'translation', title: 'Translation & Comms', desc: 'Mandarin ↔ English ↔ Swahili. We handle negotiations, contracts, and supplier chats.', icon: '', color: 'from-green-500 to-emerald-400' },
    { id: 'market-guide', title: 'Market Intelligence', desc: 'Pricing benchmarks, MOQ standards, supplier reliability scores, and regional demand insights.', icon: '📊', color: 'from-yellow-500 to-orange-400' },
    { id: 'factory-visits', title: 'Factory & QC Visits', desc: 'On-ground inspections, production audits, and quality control. Your eyes and ears in China.', icon: '🏭', color: 'from-rose-500 to-red-400' },
    { id: 'payments', title: 'Secure Payments', desc: 'Transparent supplier payments. Full receipt tracking, escrow-style transfers, and FX conversion.', icon: '💳', color: 'from-teal-500 to-cyan-400' },
    { id: 'warehousing', title: 'Warehousing & Prep', desc: 'Short or long-term storage in Guangzhou/Yiwu. Labeling, repackaging, and prep before shipping.', icon: '', color: 'from-slate-500 to-gray-400' },
    { id: 'hotel-bookings', title: 'Travel & Logistics', desc: 'Visa support, flight routing, hotel bookings, and local transport. We handle the logistics.', icon: '🏨', color: 'from-amber-500 to-yellow-400' }
]

export default function ServiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const serviceId = params.id as string

    const [service, setService] = useState<any>(null)

    useEffect(() => {
        // Find the service data based on the URL ID
        const found = SERVICES.find(s => s.id === serviceId)
        if (!found) {
            router.replace('/services') // Redirect if invalid ID
            return
        }
        setService(found)
        console.log(`[ServiceDetail] Loaded details for: ${found.title}`)
    }, [serviceId, router])

    if (!service) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading service...</div>

    return (
        <main className="min-h-screen bg-gray-50 pb-20">

            {/* Back Link */}
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <Link href="/services" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 transition">
                    ← Back to all services
                </Link>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">

                {/* Left: Service Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pt-4"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <span className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-4xl shadow-lg`}>
                            {service.icon}
                        </span>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Service Detail</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                {service.title}
                            </h1>
                        </div>
                    </div>

                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        {service.desc}
                    </p>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">What&apos;s Included:</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center gap-2">✓ Dedicated agent for your region</li>
                            <li className="flex items-center gap-2">✓ Transparent cost breakdown</li>
                            <li className="flex items-center gap-2">✓ Real-time WhatsApp updates</li>
                            <li className="flex items-center gap-2">✓ Quality control checks</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Right: Quote Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="sticky top-24"
                >
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                        {/* Pass the service title so the form header updates dynamically */}
                        <ServiceQuoteForm serviceName={service.title} />
                    </div>
                </motion.div>
            </div>
        </main>
    )
}