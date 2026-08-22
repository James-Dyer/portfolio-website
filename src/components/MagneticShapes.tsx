import { useMemo, useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

interface Shape {
  x: number; y: number; baseX: number; baseY: number; vx: number; vy: number
  size: number; rotation: number; rotationSpeed: number
  type: 'circle' | 'square' | 'triangle' | 'ring' | 'cross'
  color: string; behavior: 'attract' | 'repel' | 'orbit' | 'shy'; strength: number; opacity: number; parallax: number
}

const colors = ['#00f5ff', '#ff00aa', '#b347ff', '#4d7cff', '#f0f0f5']
const types: Shape['type'][] = ['circle', 'square', 'triangle', 'ring', 'cross']
const behaviors: Shape['behavior'][] = ['attract', 'repel', 'orbit', 'shy']

function createShapes() {
  if (typeof window === 'undefined') return []
  const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 40000), 25)
  return Array.from({ length: count }, () => {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    return {
      x, y, baseX: x, baseY: y, vx: 0, vy: 0,
      size: Math.random() * 30 + 15,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
      strength: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.2,
      parallax: Math.random() * 0.14 + 0.08,
    } satisfies Shape
  })
}

function wrap(value: number, min: number, max: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

export default function MagneticShapes() {
  const shapes = useMemo(() => createShapes(), [])
  const container = useRef<HTMLDivElement>(null)
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouse = useRef({ x: 0, y: 0, active: false })
  const dims = useRef({ w: window.innerWidth, h: window.innerHeight })
  const scrollY = useRef(window.scrollY)

  useGSAP(() => {
    const elements = shapeRefs.current.filter((element): element is HTMLDivElement => Boolean(element))
    gsap.set(elements, {
      x: (index) => shapes[index].x,
      y: (index) => shapes[index].y,
      xPercent: -50,
      yPercent: -50,
      rotation: (index) => shapes[index].rotation,
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setX = elements.map(element => gsap.quickSetter(element, 'x', 'px'))
    const setY = elements.map(element => gsap.quickSetter(element, 'y', 'px'))
    const setRotation = elements.map(element => gsap.quickSetter(element, 'rotation', 'deg'))
    const scrollTracker = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: () => { scrollY.current = window.scrollY },
      onRefresh: () => { scrollY.current = window.scrollY },
    })
    let frame = 0
    const onMove = (event: PointerEvent) => { mouse.current = { x: event.clientX, y: event.clientY, active: true } }
    const onLeave = () => { mouse.current.active = false }
    const onResize = () => {
      const { w, h } = dims.current
      shapes.forEach(s => {
        s.baseX = (s.baseX / w) * window.innerWidth
        s.baseY = (s.baseY / h) * window.innerHeight
      })
      dims.current = { w: window.innerWidth, h: window.innerHeight }
    }
    const animate = () => {
      shapes.forEach((shape, index) => {
        const wrapPadding = Math.max(70, shape.size * 2)
        const screenY = wrap(shape.y - scrollY.current * shape.parallax, -wrapPadding, dims.current.h + wrapPadding)
        if (mouse.current.active) {
          const dx = mouse.current.x - shape.x
          const dy = mouse.current.y - screenY
          const distance = Math.hypot(dx, dy)
          if (distance < 300) {
            const force = (1 - distance / 300) * shape.strength
            const angle = Math.atan2(dy, dx)
            const direction = shape.behavior === 'attract' ? 2
              : shape.behavior === 'repel' ? -3
              : shape.behavior === 'orbit' ? 0.3
              : shape.behavior === 'shy' && distance < 150 ? -5
              : 0
            shape.vx += Math.cos(angle) * force * direction
            shape.vy += Math.sin(angle) * force * direction
            if (shape.behavior === 'orbit') {
              shape.vx += Math.cos(angle + Math.PI / 2) * force * 2
              shape.vy += Math.sin(angle + Math.PI / 2) * force * 2
            }
          }
        }
        shape.vx = (shape.vx + (shape.baseX - shape.x) * 0.02) * 0.92
        shape.vy = (shape.vy + (shape.baseY - shape.y) * 0.02) * 0.92
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation = (shape.rotation + shape.rotationSpeed) % 360
        setX[index]?.(shape.x)
        setY[index]?.(wrap(shape.y - scrollY.current * shape.parallax, -wrapPadding, dims.current.h + wrapPadding))
        setRotation[index]?.(shape.rotation)
      })
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      scrollTracker.kill()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, { scope: container, dependencies: [shapes] })

  return (
    <div ref={container} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {shapes.map((shape, index) => (
        <div
          key={index}
          ref={(element) => { shapeRefs.current[index] = element }}
          style={{
            position: 'absolute', left: 0, top: 0, width: shape.size, height: shape.size, opacity: shape.opacity,
            borderRadius: shape.type === 'circle' || shape.type === 'ring' ? '50%' : shape.type === 'square' ? '4px' : undefined,
            border: shape.type === 'ring' ? `3px solid ${shape.color}` : undefined,
            background: shape.type === 'ring' || shape.type === 'cross' ? 'transparent' : shape.color,
            clipPath: shape.type === 'triangle' ? 'polygon(50% 0, 100% 100%, 0 100%)' : undefined,
            willChange: 'transform',
          }}
        >
          {shape.type === 'cross' && <><span style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: 3, background: shape.color }} /><span style={{ position: 'absolute', left: '50%', top: 0, width: 3, height: '100%', background: shape.color }} /></>}
        </div>
      ))}
    </div>
  )
}
