// src/app/industries/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { QuickQuoteForm } from '@/components/quote/QuickQuoteForm'

// --- SEO METADATA ---
export const metadata: Metadata = {
    title: 'Import Industries We Serve | Electronics, Fashion, Industrial & More | Source & Imports by Dess',
    description: 'Specialized import solutions for electronics, fashion, industrial equipment, household goods & beauty products. Kenya-rooted, China-based sourcing with transparent pricing.',
    keywords: [
        'import electronics from china',
        'fashion sourcing kenya',
        'industrial equipment china',
        'household goods import',
        'beauty products china kenya',
        'china sourcing for businesses',
        'cargo consolidation kenya',
        'wholesale import africa'
    ],
    openGraph: {
        title: 'Import Industries We Serve | Source & Imports by Dess',
        description: 'Specialized import solutions for electronics, fashion, industrial equipment & more. Kenya-rooted, China-based.',
        type: 'website',
        locale: 'en_KE',
        siteName: 'Source & Imports by Dess',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Import Industries We Serve',
        description: 'Specialized sourcing for electronics, fashion, industrial & more.',
    },
    alternates: {
        canonical: 'https://sourceimportsbydess.com/industries',
    },
}

// --- INDUSTRY DATA ---
const INDUSTRIES = [
    {
        id: 'electronics',
        title: 'Electronics & Gadgets',
        icon: '🔌',
        shortDesc: 'Phones, accessories, components & consumer electronics.',
        fullDesc: 'From smartphones and laptops to circuit boards and chargers, we source verified electronics directly from Shenzhen factories. Quality checks, warranty support, and bulk pricing included.',
        image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/Electronics.avif',
        keywords: ['electronics import', 'china gadgets', 'phone sourcing', 'laptop wholesale'],
        features: ['Factory-direct pricing', 'CE/FCC certification support', 'Warranty coordination', 'Bulk order discounts'],
        cta: 'Get Electronics Quote'
    },
    {
        id: 'fashion',
        title: 'Fashion & Textiles',
        icon: '👗',
        shortDesc: 'Apparel, fabrics, accessories & footwear.',
        fullDesc: 'Trendy clothing, custom uniforms, fabrics, and accessories sourced from Guangzhou and Hangzhou. Sample approval, size grading, and private label support available.',
        image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/Fashion.avif',
        keywords: ['fashion import kenya', 'clothing wholesale china', 'textile sourcing', 'custom apparel'],
        features: ['Sample approval process', 'Private label options', 'Size grading support', 'Seasonal trend guidance'],
        cta: 'Get Fashion Quote'
    },
    {
        id: 'industrial',
        title: 'Industrial Equipment',
        icon: '⚙️',
        shortDesc: 'Machinery, tools, spare parts & manufacturing supplies.',
        fullDesc: 'Heavy machinery, power tools, spare parts, and factory equipment sourced from verified Chinese manufacturers. Technical documentation, installation support, and after-sales coordination.',
        image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/Industrial.avif',
        keywords: ['industrial machinery china', 'factory equipment kenya', 'spare parts import', 'manufacturing supplies'],
        features: ['Technical specification support', 'Installation guidance', 'Spare parts coordination', 'After-sales liaison'],
        cta: 'Get Industrial Quote'
    },
    {
        id: 'household',
        title: 'Household Goods',
        icon: '🏠',
        shortDesc: 'Home décor, kitchenware, furniture & daily essentials.',
        fullDesc: 'Affordable home products sourced from Yiwu and Foshan markets. From kitchen gadgets to furniture, we handle quality checks, packaging, and consolidation for cost-effective shipping.',
        image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/Household.avif',
        keywords: ['home goods import', 'kitchenware china', 'furniture sourcing kenya', 'wholesale household'],
        features: ['Market sourcing expertise', 'Quality inspection', 'Consolidation savings', 'Packaging optimization'],
        cta: 'Get Household Quote'
    },
    {
        id: 'beauty',
        title: 'Beauty & Personal Care',
        icon: '💄',
        shortDesc: 'Cosmetics, skincare, haircare & wellness products.',
        fullDesc: 'Trending beauty products, skincare lines, and personal care items sourced from Guangzhou beauty hubs. FDA/KEBS compliance guidance, private label options, and sample testing support.',
        image: 'https://oyvmuhxzlyhduxuiynxu.supabase.co/storage/v1/object/public/quote-files/home/Beauty.avif',
        keywords: ['beauty products china', 'cosmetics import kenya', 'skincare wholesale', 'personal care sourcing'],
        features: ['Regulatory compliance support', 'Private label development', 'Sample testing coordination', 'Trend forecasting'],
        cta: 'Get Beauty Quote'
    }
]

// --- INDUSTRY CARD COMPONENT ---
function IndustryCard({ industry, index }: { industry: typeof INDUSTRIES[0]; index: number }) {
    return (
        <article
            className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            itemScope
            itemType="https://schema.org/Service"
        >
            {/* Image Header */}
            <div className="relative h-48 md:h-56 overflow-hidden">
                <Image
                    src={industry.image}
                    alt={`${industry.title} import from China`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={index < 2 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <span className="text-3xl bg-white/90 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                        {industry.icon}
                    </span>
                    <h3 className="text-xl font-bold text-white drop-shadow-md" itemProp="name">
                        {industry.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm" itemProp="description">
                    {industry.shortDesc}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                    {industry.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-green-600">✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Link
                    href={`/quote?industry=${industry.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition group/link"
                    itemProp="url"
                >
                    {industry.cta}
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {/* Schema Markup for Service */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": industry.title,
                        "description": industry.fullDesc,
                        "provider": {
                            "@type": "Organization",
                            "name": "Source & Imports by Dess",
                            "url": "https://sourceimportsbydess.com"
                        },
                        "areaServed": ["Kenya", "East Africa", "China"],
                        "serviceType": "Import Sourcing",
                        "keywords": industry.keywords.join(', ')
                    })
                }}
            />
        </article>
    )
}

// --- MAIN PAGE COMPONENT ---
export default function IndustriesPage() {
    return (
        <main className="min-h-screen bg-gray-50">

            {/* ===== HERO SECTION ===== */}
            <section className="relative py-16 md:py-24 px-4 bg-white border-b">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Industries We Serve
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Specialized import solutions tailored to your sector. From electronics to fashion, we understand your unique sourcing needs.
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">5+</span> Industries
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">500+</span> Suppliers Verified
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">48h</span> Avg. Response
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== INDUSTRIES GRID ===== */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {INDUSTRIES.map((industry, index) => (
                        <IndustryCard key={industry.id} industry={industry} index={index} />
                    ))}
                </div>
            </section>

            {/* ===== VALUE PROPOSITION ===== */}
            <section className="py-16 px-4 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Why Choose Us for Your Industry?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            {
                                title: 'Sector Expertise',
                                desc: 'We know the suppliers, standards, and pitfalls specific to your industry.',
                                icon: '🎯'
                            },
                            {
                                title: 'Quality Assurance',
                                desc: 'Pre-shipment inspections, certification support, and sample approval processes.',
                                icon: '✅'
                            },
                            {
                                title: 'Cost Optimization',
                                desc: 'Bulk pricing, consolidation, and logistics planning to maximize your margins.',
                                icon: '💰'
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-300 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA WITH FORM ===== */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Ready to Import for Your Business?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Tell us your industry and requirements. We&apos;ll connect you with verified suppliers and handle the rest.
                        </p>
                        <ul className="space-y-3 text-sm text-gray-700 mb-8">
                            <li className="flex items-center gap-2">
                                <span className="text-green-600">✓</span> Free, no-obligation quote
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-600">✓</span> Industry-specific supplier matching
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-600">✓</span> WhatsApp support throughout
                            </li>
                        </ul>
                        <Link
                            href="/quote"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                        >
                            Start Your Request →
                        </Link>
                    </div>

                    {/* Embedded Quick Quote Form */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Quick Quote</h3>
                        <p className="text-sm text-gray-500 text-center mb-4">Select your industry below</p>
                        <QuickQuoteForm />
                    </div>
                </div>
            </section>

            {/* ===== SEO: COLLECTION PAGE SCHEMA ===== */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Import Industries We Serve",
                        "description": "Specialized import solutions for electronics, fashion, industrial equipment, household goods & beauty products from China to Kenya.",
                        "url": "https://sourceimportsbydess.com/industries",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Source & Imports by Dess",
                            "url": "https://sourceimportsbydess.com",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://sourceimportsbydess.com/logo.png"
                            }
                        },
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": INDUSTRIES.map((ind, i) => ({
                                "@type": "ListItem",
                                "position": i + 1,
                                "item": {
                                    "@type": "Service",
                                    "name": ind.title,
                                    "description": ind.fullDesc,
                                    "url": `https://sourceimportsbydess.com/quote?industry=${ind.id}`
                                }
                            }))
                        }
                    })
                }}
            />
        </main>
    )
}