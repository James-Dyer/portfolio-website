import { type RefObject } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export function useTiltCard(
  card: RefObject<HTMLElement | null>,
  glow: RefObject<HTMLElement | null>,
) {
  useGSAP(() => {
    if (!card.current || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(card.current, 'rotationY', { duration: 0.2, ease: 'power2.out' })
    const yTo = gsap.quickTo(card.current, 'rotationX', { duration: 0.2, ease: 'power2.out' })
    const onMove = (event: PointerEvent) => {
      const rect = card.current!.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      xTo(x * 6)
      yTo(y * -6)
      glow.current?.style.setProperty('background', `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(201,168,108,.12), transparent 50%)`)
    }
    const onLeave = () => { xTo(0); yTo(0) }
    card.current.addEventListener('pointermove', onMove)
    card.current.addEventListener('pointerleave', onLeave)
    return () => {
      card.current?.removeEventListener('pointermove', onMove)
      card.current?.removeEventListener('pointerleave', onLeave)
    }
  }, { scope: card })
}
