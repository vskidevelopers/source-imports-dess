// src/components/quote/QuickQuoteForm.tsx
'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase, generateQuoteId } from '@/lib/supabase'

// ✅ Zod schema - defines both validation AND types
const quoteSchema = z.object({
    customer_name: z.string().min(2, 'Name must be at least 2 characters'),
    whatsapp: z.string().regex(/^\+?[0-9\s\-()]{10,}$/, 'Valid WhatsApp number required'),
    category: z.enum(['electronics', 'fashion', 'industrial', 'household', 'beauty']),
    item_description: z.string().min(10, 'Please describe the item in more detail'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
})

// ✅ Let Zod infer the type - no manual typing needed!
type FormData = z.infer<typeof quoteSchema>

export function QuickQuoteForm({ preselectedCategory }: { preselectedCategory?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [quoteId, setQuoteId] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(quoteSchema) as Resolver<FormData>,
        defaultValues: {
            category: (preselectedCategory as FormData['category']) || 'electronics',
            quantity: 1
        }
    })

    const onSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
        setIsSubmitting(true)
        console.log('[QuickQuoteForm] Submitting:', { ...data, timestamp: new Date().toISOString() })

        try {
            const newQuoteId = await generateQuoteId()

            const { error } = await supabase.from('quotes').insert({
                quote_id: newQuoteId,
                customer_name: data.customer_name,
                whatsapp: data.whatsapp,
                category: data.category,
                item_description: data.item_description,
                quantity: data.quantity,
                destination_country: 'Kenya',
                urgency: 'medium',
            })

            if (error) throw error

            setQuoteId(newQuoteId)
            reset()

            const waMessage = `Hi, I just submitted quote request ${newQuoteId}. Details: ${data.item_description} (${data.quantity}x). Please advise.`
            const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`
            window.open(waLink, '_blank')

        } catch (err) {
            console.error('[QuickQuoteForm] Submission failed:', err)
            alert('Something went wrong. Please WhatsApp us directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (quoteId) {
        return (
            <div className="p-6 bg-green-50 rounded-lg text-center border border-green-100">
                <p className="font-semibold text-green-800 mb-1">✅ Quote Submitted!</p>
                <p className="text-sm text-green-700">Your ID: <span className="font-mono font-bold">{quoteId}</span></p>
                <p className="text-xs text-green-600 mt-2">We&apos;ve opened WhatsApp to continue the conversation.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                    {...register('customer_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Your name"
                />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                <input
                    {...register('whatsapp')}
                    placeholder="+254..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion & Textiles</option>
                    <option value="industrial">Industrial Equipment</option>
                    <option value="household">Household Goods</option>
                    <option value="beauty">Beauty & Personal Care</option>
                </select>
                {preselectedCategory && (
                    <p className="text-xs text-blue-600 mt-1">Selected from: {preselectedCategory}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What do you need? *</label>
                <textarea
                    {...register('item_description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Describe the item, quantity, specs..."
                />
                {errors.item_description && <p className="text-red-500 text-xs mt-1">{errors.item_description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                    type="number"
                    {...register('quantity')}
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 rounded-lg transition disabled:opacity-70 shadow-md hover:shadow-lg"
            >
                {isSubmitting ? 'Submitting...' : 'Get Free Quote via WhatsApp 💬'}
            </button>

            <p className="text-xs text-center text-gray-500">
                No obligation. We reply within 2 hours.
            </p>
        </form>
    )
}