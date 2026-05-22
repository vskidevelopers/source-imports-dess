/* eslint-disable react-hooks/set-state-in-effect */
// src/components/layout/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo.png';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Tracker', href: '/tracker' },
    { label: 'Contact', href: '/contact' },
]

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        console.log('[Navbar] Mounted | Current path:', pathname)
        // Close mobile menu on route change
        setIsMobileMenuOpen(false)
    }, [pathname])

    const toggleMobileMenu = () => {
        console.log('[Navbar] Mobile menu toggled:', !isMobileMenuOpen)
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleWhatsAppClick = () => {
        console.log('[Navbar] WhatsApp CTA clicked')
        const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi,%20I%20need%20help%20with%20an%20import%20quote.`
        window.open(waLink, '_blank')
    }

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ===== LOGO ===== */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                        onClick={() => console.log('[Navbar] Logo clicked')}
                    >
                        <div className="h-8 rounded-lg flex items-center justify-center">
                            <img src={Logo.src} alt="ManuFit Logo" className="h-10 w-auto" />
                        </div>
                    </Link>

                    {/* ===== DESKTOP NAV ===== */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    onClick={() => console.log(`[Navbar] Nav link clicked: ${link.label}`)}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3">
                        {/* Quote CTA - Desktop */}
                        <Link
                            href="/quote"
                            className="hidden md:inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                            onClick={() => console.log('[Navbar] Get Quote CTA clicked')}
                        >
                            Get a Quote
                        </Link>

                        {/* WhatsApp CTA - Always Visible */}
                        <button
                            onClick={handleWhatsAppClick}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-medium rounded-lg transition"
                            aria-label="Chat on WhatsApp"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* ===== MOBILE MENU ===== */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {/* Mobile-only Quote CTA */}
                            <Link
                                href="/quote"
                                className="block w-full mt-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg"
                            >
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}