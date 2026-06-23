import { useEffect, useMemo, useRef } from 'react'

interface Shape {
  x: number; y: number; baseX: number; baseY: number; vx: number; vy: number
  size: number; rotation: number; rotationSpeed: number
  type: 'circle' | 'square' | 'triangle' | 'ring' | 'cross'
  color: string; behavior: 'attract' | 'repel' | 'orbit' | 'shy'; strength: number; opacity: number
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
    } satisfies Shape
  })
}

export default function MagneticShapes() {
  const shapes = useMemo(() => createShapes(), [])
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouse = useRef({ x: 0, y: 0, active: false })
  const dims = useRef({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
        if (mouse.current.active) {
          const dx = mouse.current.x - shape.x
          const dy = mouse.current.y - shape.y
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
        const element = shapeRefs.current[index]
        if (element) element.style.transform = `translate3d(${shape.x}px, ${shape.y}px, 0) translate(-50%, -50%) rotate(${shape.rotation}deg)`
      })
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [shapes])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {shapes.map((shape, index) => (
        <div
          key={index}
          ref={(element) => { shapeRefs.current[index] = element }}
          style={{
            position: 'absolute', left: 0, top: 0, width: shape.size, height: shape.size, opacity: shape.opacity,
            transform: `translate3d(${shape.x}px, ${shape.y}px, 0) translate(-50%, -50%) rotate(${shape.rotation}deg)`,
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
