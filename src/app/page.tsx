/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
// src/app/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useInView } from 'framer-motion'
import Image from 'next/image'
import { QuickQuoteForm } from '@/components/quote/QuickQuoteForm'
import Link from 'next/link'

// --- YOUR DATA ---
const STATS = [
  { label: 'Countries Served', value: '40+' },
  { label: 'Shipments/Month', value: '1.2k' },
  { label: 'Avg. Delivery', value: '18 Days' },
  { label: 'Client Retention', value: '98%' },
]

const PARALLAX_SECTIONS = [
  {
    id: 'ocean',
    title: 'Ocean Freight',
    subtitle: 'Consolidation • Cost Savings • Global Reach',
    desc: 'We merge your cargo with others heading to Kenya. Lower rates, faster clearance, zero hassle.',
    image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/ship.avif',
    accent: 'from-blue-600 to-cyan-500',
    align: 'left'
  },
  {
    id: 'air',
    title: 'Air Cargo',
    subtitle: 'Express • Urgent • Secure',
    desc: 'Electronics, samples, time-sensitive goods. We get it from Guangzhou to Nairobi in days, not weeks.',
    image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/airkargo.webp',
    accent: 'from-indigo-600 to-violet-500',
    align: 'right'
  },
  {
    id: 'road',
    title: 'Last-Mile Delivery',
    subtitle: 'Port • Customs • Doorstep',
    desc: 'From Mombasa port to your warehouse in Nairobi, Kisumu, or anywhere in East Africa. We handle it all.',
    image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/truck.webp',
    accent: 'from-emerald-600 to-teal-500',
    align: 'center'
  }
]

// --- STAT ITEM (Dark Theme) ---
function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center px-4 border-r last:border-0 border-gray-200"
    >
      <div className="text-3xl md:text-4xl font-bold text-gray-100 mb-1">{value}</div>
      <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

// --- PARALLAX SECTION ---
function ParallaxSection({ section, index, totalSections, scrollYProgress, isMobile }: {
  section: typeof PARALLAX_SECTIONS[0]
  index: number
  totalSections: number
  scrollYProgress: any
  isMobile: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })

  // Calculate scroll range for THIS section
  const start = index / totalSections
  const end = (index + 1) / totalSections

  // Section-specific scroll progress (0→1 as user scrolls through this section)
  const sectionProgress = useTransform(scrollYProgress, [start, end], [0, 1])

  // Parallax transforms
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const imageY = useTransform(sectionProgress, [0, 1], prefersReduced || isMobile ? [0, 0] : [0, -100])
  const imageScale = useTransform(sectionProgress, [0, 0.5, 1], [1.05, 1, 0.98])

  // Text entrance animations
  const titleY = useTransform(sectionProgress, [0, 0.15], [30, 0])
  const titleOpacity = useTransform(sectionProgress, [0, 0.15], [0, 1])
  const descY = useTransform(sectionProgress, [0.1, 0.25], [20, 0])
  const descOpacity = useTransform(sectionProgress, [0.1, 0.25], [0, 1])
  const ctaY = useTransform(sectionProgress, [0.2, 0.35], [15, 0])
  const ctaOpacity = useTransform(sectionProgress, [0.2, 0.35], [0, 1])

  const alignClasses = {
    left: 'md:text-left md:items-start md:ml-8 lg:ml-16',
    right: 'md:text-right md:items-end md:mr-8 lg:mr-16',
    center: 'md:text-center md:items-center'
  }[section.align]

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center bg-gray-950"
    >
      {/* Parallax Background Image - FIXED COVERAGE */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src={section.image}
          alt={section.title}
          fill
          priority={index === 0}
          className="object-cover"
          sizes="100vw"
          quality={90}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        {/* Stronger gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-950/70 to-gray-950/95" />
        {/* Subtle vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,gray-950/40_100%)]" />
      </motion.div>

      {/* Content - IMPROVED READABILITY */}
      <div className={`relative z-10 w-full px-6 md:px-12 flex flex-col ${alignClasses}`}>
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${section.accent} text-white text-sm font-bold mb-6 shadow-lg backdrop-blur-sm`}
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {section.subtitle}
          </motion.div>

          {/* Title - Added text shadow for contrast */}
          <motion.h2
            style={{ y: titleY, opacity: titleOpacity }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl"
          >
            {section.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            style={{ y: descY, opacity: descOpacity }}
            className="text-base md:text-lg lg:text-xl text-gray-200 max-w-xl leading-relaxed mb-8 drop-shadow-md"
          >
            {section.desc}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            style={{ y: ctaY, opacity: ctaOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href={`/services/${section.id}`}
              className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Learn More →
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator (Desktop Only) */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-20">
        <div className="w-0.5 h-24 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-white rounded-full"
            style={{ height: useTransform(sectionProgress, [0, 1], ['0%', '100%']) }}
          />
        </div>
        <span className="text-xs text-white/60 font-mono">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

// --- MAIN PAGE ---
export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mouse parallax for Hero (desktop only)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 25)
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 25)
  }
  const bgX1 = useTransform(mouseX, [-12, 12], [30, -30])
  const bgY1 = useTransform(mouseY, [-12, 12], [30, -30])
  const bgX2 = useTransform(mouseX, [-12, 12], [20, -20])
  const bgY2 = useTransform(mouseY, [-12, 12], [-20, 20])

  // Scroll progress for parallax sections
  const { scrollYProgress } = useScroll({ target: mainRef, offset: ['start start', 'end end'] })

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    console.log('[HomePage] Mounted | Minimal hero + parallax initialized')
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen bg-gray-900 text-white" onMouseMove={handleMouseMove}>

      {/* ===== 1. HERO SECTION (YOUR EXACT MINIMAL CODE) ===== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 bg-gray-800 overflow-hidden">
        {/* Background Blobs */}
        <motion.div style={{ x: bgX1, y: bgY1 }} className="absolute top-20 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        <motion.div style={{ x: bgX2, y: bgY2 }} className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Copy */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold mb-6 mx-auto md:mx-0">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Kenya • China • End-to-End Solutions
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-[1.1] mb-5 tracking-tight">
              Import from China? <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                We Handle the Hard Part.
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              End-to-end sourcing, cargo consolidation & logistics at cost-friendly rates. Real-time updates via WhatsApp. Zero hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
              <Link href="/quote" className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center">
                Get Free Quote →
              </Link>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center">
                💬 Chat on WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-gray-500 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> 500+ Businesses Served</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> 48hr Avg. Response</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> 100% Transparent Pricing</div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur-2xl opacity-25 transform rotate-3 scale-105 pointer-events-none" />
            <div className="relative bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 transition-transform duration-300 hover:scale-[1.01]">
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Quick Quote Request</h3>
                <p className="text-sm text-gray-500 mt-1">Tell us what you need. We reply within 2 hours.</p>
              </div>
              <QuickQuoteForm />
            </div>

            {/* Floating Badges */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-5 -right-3 md:-right-5 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap">
              📦 Consolidation Experts
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1.5 }} className="absolute -bottom-5 -left-3 md:-left-5 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap">
              Door-to-Door Delivery
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. STATS TRUST BAR ===== */}
      <section className="py-8 border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-4">
          {STATS.map((stat, i) => <StatItem key={i} {...stat} />)}
        </div>
      </section>

      {/* ===== 3. PARALLAX SECTIONS ===== */}
      {PARALLAX_SECTIONS.map((section, index) => (
        <ParallaxSection
          key={section.id}
          section={section}
          index={index}
          totalSections={PARALLAX_SECTIONS.length}
          scrollYProgress={scrollYProgress}
          isMobile={isMobile}
        />
      ))}

      {/* ===== 4. FINAL CTA SECTION ===== */}
      <section className="py-20 px-4 bg-gray-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Importing?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get a free, no-obligation quote in under 2 minutes. We reply within 2 hours via WhatsApp.
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

      {/* ===== 5. FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-700 mb-1">Source & Imports by Dess</p>
        <p className="text-xs">Bridging Africa & China • Your goods, our promise—shipped safely, delivered securely. 🔒</p>
        <p className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </main>
  )
}