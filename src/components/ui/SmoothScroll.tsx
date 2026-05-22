
'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        // Respect user preference for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('[SmoothScroll] Reduced motion preferred | Lenis disabled')
            return
        }

        console.log('[SmoothScroll] Initializing Lenis')
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => {
            console.log('[SmoothScroll] Cleaning up Lenis')
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}