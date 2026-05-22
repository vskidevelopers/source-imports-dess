// src/app/how-it-works/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'

// Step data matching your quote workflow
const STEPS = [
    {
        step: 1,
        title: 'Submit Your Request',
        desc: 'Tell us what you need via our quick quote form or WhatsApp. Attach images, specs, or reference links.',
        icon: '📝',
        color: 'from-blue-500 to-cyan-400',
        parallaxSpeed: 0.2,
    },
    {
        step: 2,
        title: 'We Source Suppliers',
        desc: 'Our China-based team verifies factories, negotiates pricing, and secures samples—all at cost-friendly rates.',
        icon: '🔍',
        color: 'from-purple-500 to-pink-400',
        parallaxSpeed: 0.4,
    },
    {
        step: 3,
        title: 'Quote Confirmation',
        desc: 'Receive a detailed breakdown: product cost, shipping, duties, and timeline. No hidden fees.',
        icon: '✅',
        color: 'from-yellow-500 to-orange-400',
        parallaxSpeed: 0.3,
    },
    {
        step: 4,
        title: 'Cargo Consolidation',
        desc: 'We combine your order with others heading to Kenya for lower shipping rates and faster clearance.',
        icon: '📦',
        color: 'from-green-500 to-emerald-400',
        parallaxSpeed: 0.5,
    },
    {
        step: 5,
        title: 'Shipping & Customs',
        desc: 'End-to-end logistics: export docs, ocean/air freight, Kenya customs clearance, and last-mile delivery.',
        icon: '🚢',
        color: 'from-indigo-500 to-violet-400',
        parallaxSpeed: 0.35,
    },
    {
        step: 6,
        title: 'Doorstep Delivery',
        desc: 'Your goods arrive in Nairobi, Mombasa, or nationwide. Track every step via WhatsApp or our tracker page.',
        icon: '🏠',
        color: 'from-rose-500 to-red-400',
        parallaxSpeed: 0.25,
    },
    {
        step: 7,
        title: 'Grow Your Business',
        desc: 'Focus on sales while we handle imports. Reorder anytime with saved preferences and priority support.',
        icon: '📈',
        color: 'from-teal-500 to-cyan-400',
        parallaxSpeed: 0.15,
    },
]

// Animated Step Card Component
function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    console.log(`[StepCard] Step ${step.step} mounted | In view: ${isInView}`)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className="relative p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            onMouseEnter={() => console.log(`[StepCard] Hover: Step ${step.step}`)}
        >
            {/* Step Number Badge */}
            <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                {step.step}
            </div>

            {/* Icon */}
            <div className="text-4xl mb-4">{step.icon}</div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.desc}</p>

            {/* Decorative Parallax Element */}
            <motion.div
                className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                animate={{
                    scale: isInView ? [1, 1.1, 1] : 1,
                    rotate: isInView ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    )
}

// Parallax Background Layer
function ParallaxLayer({ speed, children }: { speed: number; children: React.ReactNode }) {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 1000], [0, -100 * speed])

    return (
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
            {children}
        </motion.div>
    )
}

export default function HowItWorksPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    useEffect(() => {
        console.log('[HowItWorksPage] Mounted | Parallax journey ready')
    }, [])

    const handleQuoteCTA = () => {
        console.log('[HowItWorksPage] Quote CTA clicked | Redirecting to /quote')
    }

    const handleWhatsAppCTA = () => {
        console.log('[HowItWorksPage] WhatsApp CTA clicked')
        const link = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi,%20I'd%20like%20to%20learn%20more%20about%20your%20import%20process.`
        window.open(link, '_blank')
    }

    return (
        <main ref={containerRef} className="min-h-screen bg-white">

            {/* ===== HERO SECTION WITH PARALLAX ===== */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Parallax Background Layers */}
                <ParallaxLayer speed={0.1}>
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50" />
                </ParallaxLayer>
                <ParallaxLayer speed={0.3}>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                </ParallaxLayer>
                <ParallaxLayer speed={0.5}>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                </ParallaxLayer>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
                    >
                        How Your Import <br />
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Journey Works
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 mb-8"
                    >
                        From first click to doorstep delivery—transparent, cost-friendly, and WhatsApp-native every step.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/quote"
                            onClick={handleQuoteCTA}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg hover:shadow-xl"
                        >
                            Start Your Quote →
                        </Link>
                        <button
                            onClick={handleWhatsAppCTA}
                            className="px-8 py-4 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-medium rounded-xl transition"
                        >
                            💬 Chat on WhatsApp
                        </button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            {/* ===== STEPS TIMELINE ===== */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Import Journey, Simplified</h2>
                        <p className="text-gray-600">Seven clear steps. Zero guesswork. Full transparency.</p>
                    </div>

                    {/* Vertical Timeline Connector */}
                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-cyan-200 to-transparent hidden md:block" />

                        <div className="space-y-12">
                            {STEPS.map((step, index) => (
                                <div key={step.step} className={`relative flex flex-col md:flex-row gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-blue-500 z-10 hidden md:block" />

                                    {/* Step Card */}
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} pl-16 md:pl-0`}>
                                        <StepCard step={step} index={index} />
                                    </div>

                                    {/* Empty spacer for alternating layout */}
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA SECTION ===== */}
            <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Ready to Start Importing?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-300 mb-8 text-lg"
                    >
                        Get a free, no-obligation quote in under 2 minutes. We reply within 2 hours.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/quote"
                            onClick={handleQuoteCTA}
                            className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-medium rounded-xl transition shadow-lg"
                        >
                            Get Free Quote →
                        </Link>
                        <button
                            onClick={handleWhatsAppCTA}
                            className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium rounded-xl transition"
                        >
                            💬 WhatsApp Us Now
                        </button>
                    </motion.div>

                    <p className="mt-8 text-sm text-gray-400">
                        Or track an existing quote: <Link href="/tracker" className="text-blue-300 hover:underline">/tracker</Link>
                    </p>
                </div>
            </section>

            {/* ===== FOOTER BADGE ===== */}
            <footer className="py-8 px-4 text-center text-sm text-gray-500 border-t">
                <p>
                    <span className="font-semibold text-gray-700">Source & Imports by Dess</span> | Bridging Africa & China
                </p>
                <p className="text-xs mt-1">Your goods, our promise—shipped safely, delivered securely. 🔒</p>
            </footer>
        </main>
    )
}