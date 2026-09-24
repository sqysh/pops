'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  opacity: number
  speedX: number
  speedY: number
  opacitySpeed: number
  color: string
}

const COLORS = [
  'rgba(255, 160, 40,', // warm amber
  'rgba(255, 120, 20,', // orange
  'rgba(255, 200, 80,', // golden yellow
  'rgba(220, 80,  20,', // deep orange
  'rgba(255, 255, 180,' // warm white
]

function makeParticle(w: number, h: number): Particle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: -(Math.random() * 0.3 + 0.1), // drift upward
    opacitySpeed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
    color
  }
}

export function FloatingParticles({ count = 80 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = Array.from({ length: count }, () => makeParticle(canvas.width, canvas.height))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Move
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.opacitySpeed

        // Bounce opacity
        if (p.opacity > 0.7 || p.opacity < 0.05) p.opacitySpeed *= -1

        // Wrap around edges
        if (p.y < -p.r) p.y = canvas.height + p.r
        if (p.x < -p.r) p.x = canvas.width + p.r
        if (p.x > canvas.width + p.r) p.x = -p.r

        // Draw soft bokeh circle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5)
        gradient.addColorStop(0, `${p.color} ${p.opacity})`)
        gradient.addColorStop(0.5, `${p.color} ${p.opacity * 0.4})`)
        gradient.addColorStop(1, `${p.color} 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [count])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}
