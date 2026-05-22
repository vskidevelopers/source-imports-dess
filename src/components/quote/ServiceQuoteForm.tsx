
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, generateQuoteId } from '@/lib/supabase'

type ServiceForm = {
    customer_name: string
    whatsapp: string
    email?: string
    description: string
    quantity: number
    destination: string
    budget: string
    urgency: 'low' | 'medium' | 'high'
    category: string // Hidden
}

export function ServiceQuoteForm({ serviceName }: { serviceName: string }) {
    const [submitting, setSubmitting] = useState(false)
    const [quoteId, setQuoteId] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceForm>({
        defaultValues: {
            category: serviceName.toLowerCase().split(' ')[0], // Auto-fill category based on page
            urgency: 'medium',
            destination: 'Kenya'
        }
    })

    console.log(`[ServiceQuoteForm] Loaded for: ${serviceName}`)

    const onSubmit = async (data: ServiceForm) => {
        setSubmitting(true)
        console.log(`[ServiceQuoteForm] Submitting detailed request for: ${serviceName}`, data)

        try {
            const newQuoteId = await generateQuoteId()

            const { error } = await supabase.from('quotes').insert({
                quote_id: newQuoteId,
                customer_name: data.customer_name,
                whatsapp: data.whatsapp,
                email: data.email || null,
                category: serviceName.toLowerCase(),
                item_description: data.description,
                quantity: data.quantity,
                destination_country: data.destination,
                estimated_budget: data.budget ? parseFloat(data.budget) : null,
                urgency: data.urgency,
                files: null
            })

            if (error) throw error

            console.log('[ServiceQuoteForm] Success:', newQuoteId)
            setQuoteId(newQuoteId)
            reset()

        } catch (err) {
            console.error('[ServiceQuoteForm] Error:', err)
            alert('Submission failed. Please WhatsApp us directly.')
        } finally {
            setSubmitting(false)
        }
    }

    if (quoteId) {
        return (
            <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Request Received!</h3>
                <p className="text-green-700 mb-4">Your Reference: <span className="font-mono font-bold">{quoteId}</span></p>
                <p className="text-sm text-green-600 mb-6">We&apos;ve received your request for <b>{serviceName}</b>. An expert will review your budget and details, then contact you on WhatsApp within 2 hours.</p>
                <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I just requested a quote for ${serviceName} ID: ${quoteId}.`}
                    target="_blank"
                    className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition"
                >
                    💬 Chat with Your Agent
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Detailed Request for {serviceName}</h3>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input {...register('customer_name', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                    {errors.customer_name && <span className="text-xs text-red-500">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label>
                    <input {...register('whatsapp', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+254..." />
                    {errors.whatsapp && <span className="text-xs text-red-500">Required</span>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@business.com" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description / Specs *</label>
                <textarea {...register('description', { required: true, minLength: 10 })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., I need 500 units of Model X, color blue, delivered to Nairobi warehouse..." />
                {errors.description && <span className="text-xs text-red-500">Please provide more details</span>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input {...register('quantity', { required: true, valueAsNumber: true, min: 1 })} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input {...register('destination')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nairobi, Kenya" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget (USD/KES)</label>
                    <input {...register('budget')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Approximate" />
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition disabled:opacity-70 shadow-lg"
            >
                {submitting ? 'Submitting Request...' : 'Submit Formal Request'}
            </button>

            <p className="text-xs text-center text-gray-400">
                🔒 Your data is secure. We reply within 2 hours via WhatsApp.
            </p>
        </form>
    )
}