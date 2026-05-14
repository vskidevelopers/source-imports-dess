
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase, generateQuoteId } from '@/lib/supabase'

const schema = z.object({
    customer_name: z.string().min(2, 'Name required'),
    whatsapp: z.string().regex(/^\+?[0-9\s\-()]{10,}$/, 'Valid WhatsApp required'),
    category: z.enum(['electronics', 'fashion', 'industrial', 'household', 'beauty']),
    item_description: z.string().min(10, 'Describe the item'),
    quantity: z.coerce.number().min(1, 'Qty must be ≥1'),
})

type FormData = z.infer<typeof schema>

export function QuickQuoteForm({ preselectedCategory }: { preselectedCategory?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [quoteId, setQuoteId] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { category: preselectedCategory as any || 'electronics' }
    })

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            const newQuoteId = await generateQuoteId()

            const { error } = await supabase.from('quotes').insert({
                quote_id: newQuoteId,
                ...data,
                destination_country: 'Kenya', // default
                urgency: 'medium', // default
            })

            if (error) throw error

            setQuoteId(newQuoteId)
            reset()

            // Auto-open WhatsApp with pre-filled message
            const waMessage = `Hi, I just submitted quote request ${newQuoteId}. Details: ${data.item_description} (${data.quantity}x). Please advise.`
            const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`
            window.open(waLink, '_blank')

        } catch (err) {
            console.error('Quote submission failed:', err)
            alert('Something went wrong. Please WhatsApp us directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (quoteId) {
        return (
            <div className="p-6 bg-green-50 rounded-lg text-center">
                <p className="font-semibold text-green-800">✅ Quote Submitted!</p>
                <p className="text-sm text-green-700 mt-1">Your ID: <span className="font-mono">{quoteId}</span></p>
                <p className="text-xs text-green-600 mt-2">We've opened WhatsApp to continue the conversation.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register('customer_name')} className="w-full px-3 py-2 border rounded" />
                {errors.customer_name && <p className="text-red-500 text-xs">{errors.customer_name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input {...register('whatsapp')} placeholder="+254..." className="w-full px-3 py-2 border rounded" />
                {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select {...register('category')} className="w-full px-3 py-2 border rounded">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion & Textiles</option>
                    <option value="industrial">Industrial Equipment</option>
                    <option value="household">Household Goods</option>
                    <option value="beauty">Beauty & Personal Care</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">What do you need?</label>
                <textarea {...register('item_description')} rows={3} className="w-full px-3 py-2 border rounded" />
                {errors.item_description && <p className="text-red-500 text-xs">{errors.item_description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" {...register('quantity')} min={1} className="w-full px-3 py-2 border rounded" />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 rounded transition disabled:opacity-70"
            >
                {isSubmitting ? 'Submitting...' : 'Get Free Quote via WhatsApp 💬'}
            </button>

            <p className="text-xs text-center text-gray-500">
                No obligation. We reply within 2 hours.
            </p>
        </form>
    )
}