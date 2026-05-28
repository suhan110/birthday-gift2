import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
}

interface ParticleFieldProps {
  count?: number
}

export default function ParticleField({ count = 150 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.1 + Math.random() * 0.4),
        radius: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
      }))
    }

    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 16.67, 3)
      timeRef.current = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(p => {
        p.twinkle += p.twinkleSpeed * dt
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        const twinkledOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.twinkle))

        // Draw glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
        grd.addColorStop(0, `rgba(220, 185, 120, ${twinkledOpacity})`)
        grd.addColorStop(0.5, `rgba(180, 140, 80, ${twinkledOpacity * 0.4})`)
        grd.addColorStop(1, 'rgba(180,140,80,0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 200, ${twinkledOpacity})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
