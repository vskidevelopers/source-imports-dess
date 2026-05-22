/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const SERVICES = [
    { id: 'sourcing', title: 'Product Sourcing', desc: 'Factory verification, sample requests, and price negotiation directly from Chinese suppliers.', icon: '🔍' },
    { id: 'consolidation', title: 'Cargo Consolidation', desc: 'Merge multiple orders into one shipment. Optimize container space and slash freight costs.', icon: '📦' },
    { id: 'shipping', title: 'Shipping & Logistics', desc: 'Ocean, air, or rail freight. Export documentation, customs clearance, and last-mile delivery.', icon: '🚢' },
    { id: 'translation', title: 'Translation & Comms', desc: 'Mandarin ↔ English ↔ Swahili. We handle negotiations, contracts, and supplier chats.', icon: '💬' },
    { id: 'market-guide', title: 'Market Intelligence', desc: 'Pricing benchmarks, MOQ standards, supplier reliability scores, and regional demand insights.', icon: '📊' },
    { id: 'factory-visits', title: 'Factory & QC Visits', desc: 'On-ground inspections, production audits, and quality control. Your eyes and ears in China.', icon: '🏭' },
    { id: 'payments', title: 'Secure Payments', desc: 'Transparent supplier payments. Full receipt tracking, escrow-style transfers, and FX conversion.', icon: '💳' },
    { id: 'warehousing', title: 'Warehousing & Prep', desc: 'Short or long-term storage in Guangzhou/Yiwu. Labeling, repackaging, and prep before shipping.', icon: '🏢' },
    { id: 'hotel-bookings', title: 'Travel & Logistics', desc: 'Visa support, flight routing, hotel bookings, and local transport. We handle the logistics.', icon: '🏨' }
]

function ServiceCard({ service, index, cardProgress }: {
    service: typeof SERVICES[0]
    index: number
    cardProgress: any
}) {
    // Fast entrance: blur clears at 6%, full opacity by 12%
    const scale = useTransform(cardProgress, [0, 0.1, 1], [0.88, 1, 1])
    const x = useTransform(cardProgress, [0, 0.06, 1], [100, 0, 0])
    const opacity = useTransform(cardProgress, [0, 0.04, 0.12], [0, 1, 1])
    const filter = useTransform(cardProgress, [0, 0.06, 1], ['blur(5px)', 'blur(0px)', 'blur(0px)'])

    return (
        <motion.div
            style={{ scale, x, opacity, filter }}
            className="flex-shrink-0 w-[300px] md:w-[380px] bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
        >
            <div className="text-6xl font-bold text-pink-400/80 mb-4">
                {String(index + 1).padStart(2, '0')}
            </div>

            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-5">
                {service.icon}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                {service.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                {service.desc}
            </p>

            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/services/${service.id}`}
                    className="px-5 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition text-sm"
                >
                    Get Quote →
                </Link>
                <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi,%20I%20need%20${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition text-sm"
                >
                    💬 WhatsApp
                </a>
            </div>
        </motion.div>
    )
}

export default function ServicesPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [trackOffset, setTrackOffset] = useState(0)

    // Calculate exact scroll distance needed (safe for SSR)
    useEffect(() => {
        const calcOffset = () => {
            if (typeof window === 'undefined') return
            const cardW = window.innerWidth < 768 ? 300 : 380
            const gap = 32
            const totalCards = SERVICES.length
            const viewport = window.innerWidth
            // How far left the track needs to travel to show last card
            const offset = (totalCards * (cardW + gap)) - viewport + 120
            setTrackOffset(offset)
        }

        calcOffset()
        window.addEventListener('resize', calcOffset)
        return () => window.removeEventListener('resize', calcOffset)
    }, [])

    // 🔒 Scroll progress mapped to the TALL container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    // Map 0→1 scroll progress to horizontal movement
    const xTranslate = useTransform(scrollYProgress, [0, 1], [0, -trackOffset])

    // Staggered entrance for each card
    const cardProgressValues = SERVICES.map((_, index) => {
        const start = (index / SERVICES.length) * 0.7
        const end = start + 0.2
        return useTransform(scrollYProgress, [start, end], [0, 1])
    })

    return (
        // ️ NO overflow-hidden here! It breaks sticky positioning
        <main className="bg-gray-950 text-white">

            {/* Hero Section (Full Viewport) */}
            <section className="h-screen flex flex-col items-center justify-center px-6 border-b border-white/10 relative bg-cover bg-center" style={{ backgroundImage: 'url(https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/servis.avif)' }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">
                        Import Services
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Scroll to explore. Each service is handled end-to-end with transparent pricing and WhatsApp-native support.
                    </p>
                </motion.div>
                <div className="absolute bottom-12 animate-bounce text-gray-500 text-sm z-10">
                    ↓ Scroll to explore
                </div>
            </section>

            {/* 🔒 PINNED HORIZONTAL CAROUSEL SECTION */}
            {/* Tall container gives scroll distance. Inner sticky wrapper pins to viewport. */}
            <section ref={containerRef} className="relative h-[380vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-gray-950">

                    {/* Particles (Your exact code) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-pink-400 rounded-full animate-pulse"
                                style={{
                                    left: `${(i * 17) % 100}%`,
                                    top: `${(i * 23) % 100}%`,
                                    animationDelay: `${0.15 * i}s`,
                                    animationDuration: `${2 + (i % 3) * 0.75}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute top-8 right-8 flex items-center gap-3 text-sm text-gray-500 z-20">
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-pink-400 rounded-full"
                                style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
                            />
                        </div>
                        <span className="font-mono tabular-nums">
                            {String(SERVICES.length).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Horizontal Track */}
                    <motion.div
                        style={{ x: xTranslate }}
                        className="flex gap-8 pl-12 md:pl-24 pt-24 will-change-transform"
                    >
                        {SERVICES.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                                cardProgress={cardProgressValues[index]}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA / Footer Section (Unpins after carousel finishes) */}
            <section className="h-screen flex items-center justify-center px-6 bg-gray-950 border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-4 uppercase"
                    >
                        Need a Custom Package?
                    </motion.h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        We combine services to match your exact volume, timeline, and budget. Get a tailored quote in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/quote" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition">
                            Get Free Quote →
                        </Link>
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                            target="_blank"
                            className="px-8 py-4 border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition"
                        >
                            💬 Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}