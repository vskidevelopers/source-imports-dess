// src/app/quote/page.tsx
import { Suspense } from 'react'
import { QuoteFormWrapper } from '@/components/quote/QuoteFormWrapper'

export default function QuotePage() {
    return (
        <main className="min-h-screen py-16 px-4 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Detailed Quote</h1>
                <p className="text-gray-600 mb-8">
                    Fill in your requirements. Attach reference images if available. We&apos;ll respond with pricing & logistics options.
                </p>

                {/* ✅ Suspense boundary for useSearchParams */}
                <Suspense fallback={
                    <div className="bg-white p-6 rounded-xl shadow animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                }>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <QuoteFormWrapper />
                    </div>
                </Suspense>
            </div>
        </main>
    )
}