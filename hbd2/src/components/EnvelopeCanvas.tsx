import { useEffect, useRef, useState, useCallback } from 'react'

interface EnvelopeCanvasProps {
  mouseX: number
  mouseY: number
  onOpen: () => void
}

export default function EnvelopeCanvas({ mouseX, mouseY, onOpen }: EnvelopeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    clicked: false,
    flapAngle: 0,     // 0 = closed, 1 = fully open
    letterY: 0,       // 0 = hidden, 1 = peeking
    glowAlpha: 0,
    floatY: 0,
    floatTime: 0,
    hovered: false,
  })
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Smooth mouse interpolation
  const smoothMouseRef = useRef({ x: 0, y: 0 })

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const W = canvas.width / dpr
    const H = canvas.height / dpr
    const dt = Math.min((timestamp - lastTimeRef.current) / 16.67, 3)
    lastTimeRef.current = timestamp

    const s = stateRef.current

    // Interpolate mouse
    smoothMouseRef.current.x += (mouseX - smoothMouseRef.current.x) * 0.05
    smoothMouseRef.current.y += (mouseY - smoothMouseRef.current.y) * 0.05

    // Float animation
    s.floatTime += 0.016 * dt
    s.floatY = Math.sin(s.floatTime * 0.8) * 8

    // Hover glow
    s.glowAlpha += (s.hovered && !s.clicked ? 1 : 0 - s.glowAlpha) * 0.08 * dt

    // Open animation
    if (s.clicked) {
      s.flapAngle = Math.min(s.flapAngle + 0.025 * dt, 1)
      s.letterY = Math.min(s.letterY + 0.02 * dt, 1)
    }

    ctx.clearRect(0, 0, W, H)
    ctx.save()

    const cx = W / 2
    const cy = H / 2 + s.floatY

    // 3D tilt transformation
    const tiltX = smoothMouseRef.current.y * 15  // pitch
    const tiltY = smoothMouseRef.current.x * 22  // yaw

    const EW = Math.min(W * 0.72, 420)
    const EH = EW * 0.65

    // Perspective scale based on tilt
    const scaleX = Math.cos((tiltY * Math.PI) / 180) * 0.18 + 0.82
    const scaleY = Math.cos((tiltX * Math.PI) / 180) * 0.1 + 0.9
    const shearX = Math.sin((tiltY * Math.PI) / 180) * 0.25
    const shearY = Math.sin((tiltX * Math.PI) / 180) * 0.15
    const hoverScale = s.hovered && !s.clicked ? 1.06 : 1.0

    ctx.translate(cx, cy)
    ctx.transform(scaleX * hoverScale, shearY * hoverScale, shearX * hoverScale, scaleY * hoverScale, 0, 0)

    const x0 = -EW / 2
    const y0 = -EH / 2

    // --- SHADOW ---
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.7)'
    ctx.shadowBlur = 60
    ctx.shadowOffsetY = 30
    ctx.fillStyle = 'rgba(0,0,0,0.01)'
    ctx.fillRect(x0 + 4, y0 + EH - 10, EW - 8, 20)
    ctx.restore()

    // --- ENVELOPE BODY ---
    ctx.save()
    const bodyGrad = ctx.createLinearGradient(x0, y0, x0, y0 + EH)
    bodyGrad.addColorStop(0, '#f0e0b0')
    bodyGrad.addColorStop(0.3, '#e8d5a3')
    bodyGrad.addColorStop(0.7, '#d4b87a')
    bodyGrad.addColorStop(1, '#c49040')
    ctx.fillStyle = bodyGrad
    ctx.strokeStyle = '#a87840'
    ctx.lineWidth = 1.5

    // Body with slightly rounded corners
    roundRect(ctx, x0, y0, EW, EH, 4)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    // --- INNER V-LINES (diagonal fold lines) ---
    ctx.save()
    ctx.strokeStyle = 'rgba(160, 110, 50, 0.5)'
    ctx.lineWidth = 1

    // Bottom triangle
    ctx.beginPath()
    ctx.moveTo(x0, y0 + EH)
    ctx.lineTo(x0 + EW / 2, y0 + EH / 2)
    ctx.lineTo(x0 + EW, y0 + EH)
    ctx.stroke()

    // Side lines (going from corners to center)
    ctx.strokeStyle = 'rgba(160, 110, 50, 0.3)'
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x0 + EW / 2, y0 + EH / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x0 + EW, y0)
    ctx.lineTo(x0 + EW / 2, y0 + EH / 2)
    ctx.stroke()

    ctx.restore()

    // --- LETTER PEEKING OUT ---
    if (s.clicked && s.letterY > 0) {
      ctx.save()
      const letterEase = easeOut(s.letterY)
      const letterHeight = EH * 0.75
      const letterPeekY = y0 + EH * 0.1 - letterEase * EH * 0.45
      const lx = x0 + EW * 0.08
      const lw = EW * 0.84

      // Letter shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetY = 4

      const letterGrad = ctx.createLinearGradient(lx, letterPeekY, lx, letterPeekY + letterHeight)
      letterGrad.addColorStop(0, '#faf5e8')
      letterGrad.addColorStop(0.5, '#f5ecd5')
      letterGrad.addColorStop(1, '#ece0c0')
      ctx.fillStyle = letterGrad
      ctx.strokeStyle = 'rgba(180,140,80,0.4)'
      ctx.lineWidth = 1

      roundRect(ctx, lx, letterPeekY, lw, letterHeight, 2)
      ctx.fill()
      ctx.stroke()
      ctx.shadowColor = 'transparent'

      // Handwritten lines on letter
      if (letterEase > 0.3) {
        ctx.save()
        ctx.globalAlpha = Math.min((letterEase - 0.3) / 0.5, 1) * 0.4
        ctx.strokeStyle = '#8b6540'
        ctx.lineWidth = 0.8
        const lineSpacing = 16
        const numLines = 5
        const startY = letterPeekY + 18
        for (let i = 0; i < numLines; i++) {
          const ly = startY + i * lineSpacing
          if (ly < letterPeekY + letterHeight - 10 && ly > y0) {
            ctx.beginPath()
            ctx.moveTo(lx + 12, ly)
            ctx.lineTo(lx + lw - 12 - (i % 3 === 0 ? 30 : i % 3 === 1 ? 15 : 0), ly)
            ctx.stroke()
          }
        }
        ctx.restore()
      }

      ctx.restore()
    }

    // --- FLAP ---
    ctx.save()
    const flapEase = easeInOut(s.flapAngle)
    const flapOpenAngle = flapEase * Math.PI * 1.05 // flip beyond 180 for fold-back

    // Clip to top half of envelope only
    ctx.beginPath()
    ctx.rect(x0 - 2, y0 - 2, EW + 4, EH / 2 + 2)
    if (!s.clicked) {
      // Draw closed flap (triangle pointing down)
      ctx.restore()
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x0 + EW / 2, y0 + EH / 2)
      ctx.lineTo(x0 + EW, y0)
      ctx.closePath()

      const flapGrad = ctx.createLinearGradient(x0, y0, x0, y0 + EH / 2)
      flapGrad.addColorStop(0, '#c49040')
      flapGrad.addColorStop(1, '#d4b87a')
      ctx.fillStyle = flapGrad
      ctx.fill()
      ctx.strokeStyle = '#a87840'
      ctx.lineWidth = 1.2
      ctx.stroke()
    } else {
      // Animated open flap
      ctx.restore()
      ctx.save()

      // Use canvas transform to simulate 3D fold
      const foldProgress = flapOpenAngle / (Math.PI * 1.05)
      const yScale = Math.cos(flapOpenAngle)
      const flapH = EH / 2

      ctx.save()
      ctx.translate(x0 + EW / 2, y0)
      ctx.transform(1, 0, 0, yScale, 0, 0)

      ctx.beginPath()
      ctx.moveTo(-EW / 2, 0)
      ctx.lineTo(0, flapH)
      ctx.lineTo(EW / 2, 0)
      ctx.closePath()

      // Front or back face depending on rotation
      if (yScale > 0) {
        // Front face
        const fg = ctx.createLinearGradient(0, 0, 0, flapH)
        fg.addColorStop(0, '#c49040')
        fg.addColorStop(1, '#d4b87a')
        ctx.fillStyle = fg
      } else {
        // Back/inside face (lighter)
        const fg = ctx.createLinearGradient(0, 0, 0, flapH)
        fg.addColorStop(0, '#f0e0b8')
        fg.addColorStop(1, '#e8d5a3')
        ctx.fillStyle = fg
      }

      ctx.fill()
      ctx.strokeStyle = 'rgba(168, 120, 64, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()

      // Shadow line at fold
      if (foldProgress > 0.1 && foldProgress < 0.9) {
        ctx.save()
        ctx.globalAlpha = Math.sin(foldProgress * Math.PI) * 0.4
        ctx.strokeStyle = '#5a3010'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x0 + EW, y0)
        ctx.stroke()
        ctx.restore()
      }
    }
    ctx.restore()

    // --- WAX SEAL (only when closed) ---
    if (!s.clicked) {
      ctx.save()
      const sealX = x0 + EW / 2
      const sealY = y0 + EH / 2

      // Outer ring
      const sealGrad = ctx.createRadialGradient(sealX - 4, sealY - 4, 2, sealX, sealY, 20)
      sealGrad.addColorStop(0, '#e04030')
      sealGrad.addColorStop(0.6, '#991010')
      sealGrad.addColorStop(1, '#6b0808')

      ctx.beginPath()
      ctx.arc(sealX, sealY, 20, 0, Math.PI * 2)
      ctx.fillStyle = sealGrad
      ctx.shadowColor = 'rgba(150,20,20,0.6)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetY = 4
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // Inner ring
      ctx.beginPath()
      ctx.arc(sealX, sealY, 13, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,150,150,0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Star symbol
      ctx.fillStyle = 'rgba(255,200,200,0.6)'
      ctx.font = 'bold 14px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('✦', sealX, sealY)

      ctx.restore()
    }

    // --- HOVER GLOW ---
    if (s.glowAlpha > 0.01) {
      ctx.save()
      ctx.globalAlpha = s.glowAlpha * 0.4
      const glowGrad = ctx.createRadialGradient(0, 0, EW * 0.1, 0, 0, EW * 0.8)
      glowGrad.addColorStop(0, 'rgba(232,200,122,0.5)')
      glowGrad.addColorStop(1, 'rgba(232,200,122,0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.ellipse(0, 0, EW * 0.8, EH * 0.8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    ctx.restore()

    rafRef.current = requestAnimationFrame(draw)
  }, [mouseX, mouseY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      const ctx = canvas.getContext('2d')!
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)
    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const EW = Math.min(rect.width * 0.72, 420)
    const EH = EW * 0.65
    const inEnv = Math.abs(dx * rect.width / 2) < EW / 2 + 30 &&
                  Math.abs(dy * rect.height / 2) < EH / 2 + 30
    stateRef.current.hovered = inEnv
    setHovered(inEnv)
  }, [])

  const handleMouseLeave = useCallback(() => {
    stateRef.current.hovered = false
    setHovered(false)
  }, [])

  const handleClick = useCallback(() => {
    if (stateRef.current.clicked) return
    stateRef.current.clicked = true
    setClicked(true)
    // After flap opens, trigger zoom
    setTimeout(onOpen, 1600)
  }, [onOpen])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: hovered && !clicked ? 'pointer' : 'default',
          display: 'block',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Click prompt */}
      {!clicked && (
        <div
          style={{
            position: 'absolute',
            bottom: '14%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: hovered ? 'rgba(232,200,122,0.95)' : 'rgba(232,200,122,0.55)',
            letterSpacing: '0.08em',
            pointerEvents: 'none',
            transition: 'color 0.3s ease, text-shadow 0.3s ease',
            textShadow: hovered
              ? '0 0 20px rgba(232,200,122,0.8), 0 0 40px rgba(232,200,122,0.4)'
              : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {hovered ? '✨ Click to open the envelope ✨' : '✉️ Click the envelope to open'}
        </div>
      )}
    </div>
  )
}

// Helper: draw rounded rect path
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
