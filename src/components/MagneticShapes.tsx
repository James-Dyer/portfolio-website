import { useEffect, useRef, useState, useCallback } from 'react'

interface Shape {
  id: number
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  type: 'circle' | 'square' | 'triangle' | 'ring' | 'cross'
  color: string
  behavior: 'attract' | 'repel' | 'orbit' | 'shy'
  strength: number
  opacity: number
}

const COLORS = {
  cyan: '#00f5ff',
  magenta: '#ff00aa',
  purple: '#b347ff',
  blue: '#4d7cff',
  white: '#f0f0f5',
}

const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[]

function createShape(id: number, width: number, height: number): Shape {
  const types: Shape['type'][] = ['circle', 'square', 'triangle', 'ring', 'cross']
  const behaviors: Shape['behavior'][] = ['attract', 'repel', 'orbit', 'shy']

  const x = Math.random() * width
  const y = Math.random() * height

  return {
    id,
    x,
    y,
    baseX: x,
    baseY: y,
    vx: 0,
    vy: 0,
    size: Math.random() * 30 + 15,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    type: types[Math.floor(Math.random() * types.length)],
    color: COLORS[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
    behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
    strength: Math.random() * 0.5 + 0.3,
    opacity: Math.random() * 0.4 + 0.2,
  }
}

function ShapeRenderer({ shape }: { shape: Shape }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    width: shape.size,
    height: shape.size,
    transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
    opacity: shape.opacity,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  }

  switch (shape.type) {
    case 'circle':
      return (
        <div
          style={{
            ...style,
            borderRadius: '50%',
            backgroundColor: shape.color,
          }}
        />
      )
    case 'square':
      return (
        <div
          style={{
            ...style,
            backgroundColor: shape.color,
            borderRadius: '4px',
          }}
        />
      )
    case 'triangle':
      return (
        <div
          style={{
            ...style,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderLeft: `${shape.size / 2}px solid transparent`,
            borderRight: `${shape.size / 2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
          }}
        />
      )
    case 'ring':
      return (
        <div
          style={{
            ...style,
            borderRadius: '50%',
            border: `3px solid ${shape.color}`,
            backgroundColor: 'transparent',
          }}
        />
      )
    case 'cross':
      return (
        <div style={style}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              width: '100%',
              height: '3px',
              backgroundColor: shape.color,
              transform: 'translateY(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              width: '3px',
              height: '100%',
              backgroundColor: shape.color,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
      )
    default:
      return null
  }
}

export default function MagneticShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number | null>(null)

  // Initialize shapes
  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const shapeCount = Math.min(Math.floor((width * height) / 40000), 25)

    const initialShapes = Array.from({ length: shapeCount }, (_, i) =>
      createShape(i, width, height)
    )
    setShapes(initialShapes)

    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setShapes((prev) =>
        prev.map((shape) => ({
          ...shape,
          baseX: (shape.baseX / width) * newWidth,
          baseY: (shape.baseY / height) * newHeight,
        }))
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        const mouse = mouseRef.current
        let newVx = shape.vx
        let newVy = shape.vy
        let newRotation = shape.rotation + shape.rotationSpeed

        if (mouse.active) {
          const dx = mouse.x - shape.x
          const dy = mouse.y - shape.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 300

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * shape.strength
            const angle = Math.atan2(dy, dx)

            switch (shape.behavior) {
              case 'attract':
                // Attracted to cursor
                newVx += Math.cos(angle) * force * 2
                newVy += Math.sin(angle) * force * 2
                break
              case 'repel':
                // Pushed away from cursor
                newVx -= Math.cos(angle) * force * 3
                newVy -= Math.sin(angle) * force * 3
                break
              case 'orbit':
                // Orbit around cursor
                const perpAngle = angle + Math.PI / 2
                newVx += Math.cos(perpAngle) * force * 2
                newVy += Math.sin(perpAngle) * force * 2
                // Also slight attraction to maintain orbit
                newVx += Math.cos(angle) * force * 0.3
                newVy += Math.sin(angle) * force * 0.3
                break
              case 'shy':
                // Quick retreat then slow return
                if (distance < 150) {
                  newVx -= Math.cos(angle) * force * 5
                  newVy -= Math.sin(angle) * force * 5
                  // Speed up rotation when scared
                  newRotation += shape.rotationSpeed * 3
                }
                break
            }
          }
        }

        // Return to base position with spring physics
        const returnStrength = 0.02
        const dxBase = shape.baseX - shape.x
        const dyBase = shape.baseY - shape.y
        newVx += dxBase * returnStrength
        newVy += dyBase * returnStrength

        // Apply friction
        const friction = 0.92
        newVx *= friction
        newVy *= friction

        // Update position
        const newX = shape.x + newVx
        const newY = shape.y + newVy

        return {
          ...shape,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation % 360,
        }
      })
    )

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {shapes.map((shape) => (
        <ShapeRenderer key={shape.id} shape={shape} />
      ))}
    </div>
  )
}
