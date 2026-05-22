/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/contact/page.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'


type ContactForm = {
    name: string
    whatsapp: string
    email?: string
    subject: 'general' | 'partnership' | 'support' | 'other'
    message: string
}

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>()

    console.log('[ContactPage] Mounted | Ready for inquiries')

    const onSubmit = async (data: ContactForm) => {
        setSubmitting(true)
        setError('')
        console.log('[ContactPage] Submitting inquiry:', data)

        try {
            // Save to Supabase for admin tracking
            const { error: dbError } = await supabase.from('contact_inquiries').insert({
                name: data.name,
                whatsapp: data.whatsapp,
                email: data.email || null,
                subject: data.subject,
                message: data.message,
                status: 'new',
                created_at: new Date().toISOString()
            })

            if (dbError) throw dbError

            console.log('[ContactPage] ✅ Saved to Supabase')
            setSent(true)
            reset()

            // Open WhatsApp for instant conversation
            const waMsg = `Hi, I just submitted a contact inquiry. Name: ${data.name}. Subject: ${data.subject}. Message: ${data.message}`
            const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`
            window.open(waLink, '_blank')

        } catch (err: any) {
            console.error('[ContactPage] ❌ Submission failed:', err.message)
            setError('Failed to send. Please WhatsApp us directly.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Hero */}
            <section className="py-16 px-6 text-center bg-white border-b">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have a question, partnership idea, or need support? We reply within 2 hours via WhatsApp or email.
                    </p>
                </motion.div>
            </section>

            {/* Contact Grid */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

                    {/* Left: Info + Quick Actions */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                            <p className="text-gray-600 mb-6">Reach us directly through your preferred channel. We&apos;re available Monday–Saturday, 8AM–6PM EAT.</p>
                        </div>

                        <div className="grid gap-4">
                            <a href="tel:+254706870465" className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition group">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">Kenya Office</p>
                                    <p className="text-sm text-gray-500">+254 706 870 465</p>
                                </div>
                            </a>

                            <a href="tel:+8618457926148" className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition group">
                                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-105 transition">🇨🇳</div>
                                <div>
                                    <p className="font-semibold text-gray-900">China Office</p>
                                    <p className="text-sm text-gray-500">+86 184 5792 6148</p>
                                </div>
                            </a>

                            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20 hover:bg-[#25D366]/20 transition group">
                                <div className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center text-white group-hover:scale-105 transition">💬</div>
                                <div>
                                    <p className="font-semibold text-gray-900">WhatsApp Direct</p>
                                    <p className="text-sm text-gray-600">Fastest response time</p>
                                </div>
                            </a>

                            <a href="mailto:info@sourceimportsbydess.com" className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition group">
                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 group-hover:scale-105 transition">✉️</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Email</p>
                                    <p className="text-sm text-gray-500">info@sourceimportsbydess.com</p>
                                </div>
                            </a>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center text-gray-500 text-sm">
                            📍 Nairobi, Kenya & Guangzhou, China
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                        {sent ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">✅</div>
                                <h3 className="text-lg font-semibold text-green-700 mb-2">Message Sent!</h3>
                                <p className="text-gray-600 mb-4">We&apos;ve logged your inquiry and opened WhatsApp for instant follow-up.</p>
                                <button onClick={() => setSent(false)} className="text-sm text-blue-600 hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your name" />
                                    {errors.name && <span className="text-xs text-red-500">Required</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label>
                                    <input {...register('whatsapp', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+254..." />
                                    {errors.whatsapp && <span className="text-xs text-red-500">Required</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                    <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@company.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select {...register('subject')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="general">General Inquiry</option>
                                        <option value="partnership">Business Partnership</option>
                                        <option value="support">Customer Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                    <textarea {...register('message', { required: true, minLength: 10 })} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How can we help?" />
                                    {errors.message && <span className="text-xs text-red-500">Please provide more details</span>}
                                </div>

                                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition disabled:opacity-70 shadow-md"
                                >
                                    {submitting ? 'Sending...' : 'Send Message & Open WhatsApp'}
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    🔒 Your inquiry is logged securely. We respond within 2 hours.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Source & Imports by Dess",
                        "telephone": ["+254706870465", "+8618457926148"],
                        "email": "info@sourceimportsbydess.com",
                        "address": [
                            { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" },
                            { "@type": "PostalAddress", "addressLocality": "Guangzhou", "addressCountry": "CN" }
                        ],
                        "url": "https://sourceimportsbydess.com/contact",
                        "priceRange": "$$",
                        "openingHours": "Mo-Sa 08:00-18:00"
                    })
                }}
            />
        </main>
    )
}