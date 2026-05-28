import { useState, useCallback, useEffect } from 'react'
import EnvelopeCanvas from './components/EnvelopeCanvas'
import ParticleField from './components/ParticleField'
import StarField from './components/StarField'
import VintagePage from './components/VintagePage'
import './styles/vintage.css'

export default function App() {
  const [showInside, setShowInside] = useState(false)
  const [zoomOut, setZoomOut] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const [hintVisible, setHintVisible] = useState(false)

  useEffect(() => {
    // Delay hint to appear after load
    const t1 = setTimeout(() => setHintVisible(true), 1200)
    const t2 = setTimeout(() => setHintVisible(false), 5500)
    const t3 = setTimeout(() => setShowHint(false), 6500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = -(e.clientY / window.innerHeight - 0.5) * 2
    setMouseX(x)
    setMouseY(y)
  }, [])

  const handleEnterInside = useCallback(() => {
    setZoomOut(true)
    setTimeout(() => {
      setShowInside(true)
    }, 1200)
  }, [])

  return (
    <div
      className="app-root"
      onMouseMove={handleMouseMove}
    >
      {/* =========  FIRST SCREEN  ========= */}
      {!showInside && (
        <div className={`first-screen ${zoomOut ? 'zoom-into' : ''}`}>

          {/* Deep space background */}
          <div className="bg-gradient" />

          {/* Star layers */}
          <div className="nebula nebula-1" />
          <div className="nebula nebula-2" />
          <div className="nebula nebula-3" />

          {/* Twinkling stars canvas */}
          <StarField />

          {/* Floating golden particles */}
          <ParticleField count={120} />

          {/* Main UI layout */}
          <div className="ui-overlay">

            {/* Top title */}
            <div className="top-title">
              <div className="top-ornament">✦ ✦ ✦</div>
              <span className="top-title-text">A Letter Awaits You Selbi💛</span>
              <div className="top-subtitle">Прикоснись к магии  &mdash;✨</div>
            </div>

            {/* Envelope */}
            <div className="envelope-wrapper">
              <EnvelopeCanvas
                mouseX={mouseX}
                mouseY={mouseY}
                onOpen={handleEnterInside}
              />
            </div>

            {/* Bottom section */}
            <div className="bottom-section">
              {showHint && (
                <div className={`click-hint ${hintVisible ? 'visible' : ''}`}>
                  <div className="hint-inner">
                    <span className="hint-icon">✉️</span>
                    <span>Click the envelope to open</span>
                  </div>
                </div>
              )}
              <div className="bottom-bar">
                <div className="bottom-line" />
                <p className="bottom-tagline">Сrafted with love</p>
              </div>
            </div>

          </div>

          {/* Vignette */}
          <div className="vignette" />
        </div>
      )}

      {/* =========  ZOOM TRANSITION  ========= */}
      <div className={`transition-flash ${zoomOut ? 'active' : ''}`} />

      {/* =========  VINTAGE PAGE  ========= */}
      <VintagePage visible={showInside} />
    </div>
  )
}
