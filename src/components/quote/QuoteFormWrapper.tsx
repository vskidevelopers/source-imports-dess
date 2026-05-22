/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// src/components/quote/QuoteFormWrapper.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase, generateQuoteId } from '@/lib/supabase'
import { FileUpload } from './FileUpload'

// Zod schema + inferred type
const quoteSchema = z.object({
    name: z.string().min(2, 'Name required'),
    whatsapp: z.string().regex(/^\+?[0-9\s\-()]{10,}$/, 'Valid WhatsApp required'),
    email: z.string().email().optional().or(z.literal('')),
    category: z.enum(['electronics', 'fashion', 'industrial', 'household', 'beauty']),
    item: z.string().min(10, 'Describe the item'),
    quantity: z.coerce.number().int().min(1, 'Qty must be ≥1'),
    destination: z.string().default('Kenya'),
    budget: z.string().optional(),
}).strict()

type FormData = z.infer<typeof quoteSchema>

// Map industry slugs to category values
const INDUSTRY_MAP: Record<string, FormData['category']> = {
    electronics: 'electronics',
    fashion: 'fashion',
    industrial: 'industrial',
    household: 'household',
    beauty: 'beauty',
}

export function QuoteFormWrapper() {
    const searchParams = useSearchParams()
    const [submitting, setSubmitting] = useState(false)
    const [quoteId, setQuoteId] = useState<string | null>(null)
    const [fileUrls, setFileUrls] = useState<string[]>([])
    const [preselectedCategory, setPreselectedCategory] = useState<FormData['category']>('electronics')

    // Read industry param from URL
    useEffect(() => {
        const industry = searchParams.get('industry')
        if (industry && industry in INDUSTRY_MAP) {
            setPreselectedCategory(INDUSTRY_MAP[industry])
            console.log(`[QuoteFormWrapper] Pre-selected category: ${INDUSTRY_MAP[industry]}`)
        }
    }, [searchParams])

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
        resolver: zodResolver(quoteSchema) as unknown as Resolver<FormData>,
        defaultValues: {
            category: preselectedCategory,
            quantity: 1,
            destination: 'Kenya'
        }
    })

    // Sync preselected category to form
    useEffect(() => {
        setValue('category', preselectedCategory)
    }, [preselectedCategory, setValue])

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setSubmitting(true)
        console.log('[QuoteFormWrapper] Submitting:', { ...data, files: fileUrls })

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

            console.log('[QuoteFormWrapper] Quote saved:', newQuoteId)
            setQuoteId(newQuoteId)
            reset()
            setFileUrls([])

            // Open WhatsApp
            const waMsg = `Hi, I just submitted quote ${newQuoteId}. Details: ${data.item} (${data.quantity}x). Please advise.`
            const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`
            window.open(waLink, '_blank')

        } catch (err) {
            console.error('[QuoteFormWrapper] Error:', err)
            alert('Submission failed. Please WhatsApp us directly.')
        } finally {
            setSubmitting(false)
        }
    }

    if (quoteId) {
        return (
            <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Quote Request Received</h3>
                <p className="text-green-700 mb-4">Reference ID: <span className="font-mono font-bold">{quoteId}</span></p>
                <p className="text-sm text-green-600 mb-6">We&apos;ll review your details and reply on WhatsApp within 2 hours.</p>
                <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I submitted quote ${quoteId}. Please confirm.`}
                    target="_blank"
                    className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition"
                >
                    💬 Continue on WhatsApp
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input {...register('name')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                    <input {...register('whatsapp')} placeholder="+254..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select {...register('category')} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion & Textiles</option>
                        <option value="industrial">Industrial Equipment</option>
                        <option value="household">Household Goods</option>
                        <option value="beauty">Beauty & Personal Care</option>
                    </select>
                    {preselectedCategory && (
                        <p className="text-xs text-blue-600 mt-1">Selected: {preselectedCategory}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input {...register('quantity')} type="number" min={1} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Description *</label>
                <textarea {...register('item')} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.item && <p className="text-red-500 text-xs mt-1">{errors.item.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input {...register('destination')} placeholder="Kenya" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget (USD/KES)</label>
                    <input {...register('budget')} placeholder="e.g., 5000" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            <FileUpload onFilesChange={setFileUrls} />

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-60"
            >
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
        </form>
    )
}