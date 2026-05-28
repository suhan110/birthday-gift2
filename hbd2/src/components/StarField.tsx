import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Re-init stars on resize
      starsRef.current = Array.from({ length: 220 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 0.3 + Math.random() * 1.8,
        opacity: 0.2 + Math.random() * 0.8,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
      }))
    }

    let lastTime = 0
    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 16.67, 3)
      lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach(star => {
        star.twinkle += star.twinkleSpeed * dt
        const alpha = star.opacity * (0.4 + 0.6 * Math.abs(Math.sin(star.twinkle)))

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 210, ${alpha})`
        ctx.fill()

        // Bigger stars get a glow
        if (star.size > 1.2) {
          const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
          grd.addColorStop(0, `rgba(255, 230, 180, ${alpha * 0.5})`)
          grd.addColorStop(1, 'rgba(255,230,180,0)')
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }
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
  }, [])

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
