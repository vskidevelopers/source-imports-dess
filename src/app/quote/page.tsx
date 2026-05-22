/* eslint-disable react-hooks/set-state-in-effect */
// src/app/quote/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { supabase, generateQuoteId } from '@/lib/supabase'
import { FileUpload } from '@/components/quote/FileUpload'

type QuoteForm = {
    name: string
    whatsapp: string
    email?: string
    category: string
    item: string
    quantity: number
    destination: string
    budget?: string
    files?: string[]
}

// Map industry slugs to form category values
const INDUSTRY_MAP: Record<string, string> = {
    electronics: 'electronics',
    fashion: 'fashion',
    industrial: 'industrial',
    household: 'household',
    beauty: 'beauty',
    // Add more as needed
}

export default function QuotePage() {
    const searchParams = useSearchParams()
    const [submitting, setSubmitting] = useState(false)
    const [quoteId, setQuoteId] = useState<string | null>(null)
    const [fileUrls, setFileUrls] = useState<string[]>([])
    const [preselectedCategory, setPreselectedCategory] = useState<string>('')

    // Read industry param from URL on mount
    useEffect(() => {
        const industry = searchParams.get('industry')
        if (industry && INDUSTRY_MAP[industry]) {
            const categoryValue = INDUSTRY_MAP[industry]
            setPreselectedCategory(categoryValue)
            console.log(`[QuotePage] Pre-selected category from URL: ${categoryValue}`)
        }
    }, [searchParams])

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<QuoteForm>({
        defaultValues: {
            category: preselectedCategory || 'electronics',
            quantity: 1,
            destination: 'Kenya'
        }
    })

    // Update form when preselectedCategory changes
    useEffect(() => {
        if (preselectedCategory) {
            setValue('category', preselectedCategory)
        }
    }, [preselectedCategory, setValue])

    console.log('[QuotePage] Mounted | Ready for advanced quote submission')

    const onSubmit = async (data: QuoteForm) => {
        setSubmitting(true)
        console.log('[QuotePage] Submitting advanced quote:', { ...data, files: fileUrls })

        try {
            const newQuoteId = await generateQuoteId()

            const { error } = await supabase.from('quotes').insert({
                quote_id: newQuoteId,
                customer_name: data.name,
                whatsapp: data.whatsapp,
                email: data.email || null,
                category: data.category,
                item_description: data.item,
                quantity: data.quantity,
                destination_country: data.destination || 'Kenya',
                estimated_budget: data.budget ? parseFloat(data.budget) : null,
                files: fileUrls.length > 0 ? fileUrls : null,
                urgency: 'medium',
            })

            if (error) throw error

            console.log('[QuotePage] Quote saved:', newQuoteId)
            setQuoteId(newQuoteId)
            reset()
            setFileUrls([])

        } catch (err) {
            console.error('[QuotePage] Submission error:', err)
            alert('Something went wrong. Please try again or WhatsApp us directly.')
        } finally {
            setSubmitting(false)
        }
    }

    if (quoteId) {
        return (
            <main className="min-h-screen py-16 px-4 bg-gray-50">
                <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-2xl font-bold mb-2">✅ Quote Request Received</h2>
                    <p className="text-gray-600 mb-4">Your reference ID: <span className="font-mono font-bold">{quoteId}</span></p>
                    <p className="text-sm text-gray-500 mb-6">We&apos;ll review your details and files, then reply on WhatsApp within 2 hours.</p>
                    <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I just submitted quote ${quoteId}. Please confirm receipt.`}
                        target="_blank"
                        className="inline-block px-5 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition"
                    >
                        💬 Continue on WhatsApp
                    </a>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen py-16 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Request a Detailed Quote</h1>
                <p className="text-gray-600 mb-8">
                    Fill in your requirements. Attach reference images if available. We&apos;ll respond with pricing & logistics options.
                    {preselectedCategory && (
                        <span className="block mt-2 text-sm text-blue-600 font-medium">
                            Pre-selected: {preselectedCategory.charAt(0).toUpperCase() + preselectedCategory.slice(1)}
                        </span>
                    )}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-xl shadow">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">WhatsApp Number *</label>
                            <input {...register('whatsapp', { required: true })} placeholder="+254..." className="w-full px-3 py-2 border rounded" />
                            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">Required</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email (optional)</label>
                        <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select
                                {...register('category', { required: true })}
                                className="w-full px-3 py-2 border rounded"
                                defaultValue={preselectedCategory || 'electronics'}
                            >
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion & Textiles</option>
                                <option value="industrial">Industrial Equipment</option>
                                <option value="household">Household Goods</option>
                                <option value="beauty">Beauty & Personal Care</option>
                            </select>
                            {preselectedCategory && (
                                <p className="text-xs text-blue-600 mt-1">Selected from industry page</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity *</label>
                            <input {...register('quantity', { required: true, valueAsNumber: true, min: 1 })} type="number" className="w-full px-3 py-2 border rounded" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Item Description / Specifications *</label>
                        <textarea {...register('item', { required: true, minLength: 10 })} rows={3} className="w-full px-3 py-2 border rounded" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Destination Country</label>
                            <input {...register('destination')} placeholder="Kenya" className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estimated Budget (USD/KES)</label>
                            <input {...register('budget')} placeholder="e.g., 5000" className="w-full px-3 py-2 border rounded" />
                        </div>
                    </div>

                    <FileUpload onFilesChange={setFileUrls} />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-60"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quote Request'}
                    </button>
                </form>
            </div>
        </main>
    )
}