import { useEffect, useRef } from 'react'

const wishes = [
  {
    id: 1,
    text: "Пусть твой день будет таким же сияющим, как твой дух, таким же теплым, как твой смех, и таким же прекрасным, как радость, которую ты даришь всем вокруг. Ты поистине уникальна.",
    author: "— Your dearest friend"
  },
  {
    id: 2,
    text: "С каждым прошедшим годом ты становишься только прекраснее. Давайте вместе отпразднуем это — твои мечты, твоя сила и всё то, что делает тебя необыкновенной.",
    author: "— With all my heart"
  },
  {
    id: 3,
    text: "Говорят, что дни рождения — это способ Вселенной напомнить нам, что некоторые люди действительно особенные. Сегодня Вселенная кричит твое имя с крыш домов!",
    author: "— Forever your admirer"
  },
]

const memories = [
  { label: "#шикарная ✨" },
  { label: "#жизнерадостная 🌸" },
  { label: "#целеустремленная 🕯️" },
  { label: "#белоснежка ❄️" },
]

const timelineItems = [
  { year: "The Very Beginning", note: "В этот день мир обрел свою самую яркую звезду. ⭐" },
  { year: "Growing Up", note: "Каждый смех, каждая слеза, каждое прекрасное приключение 🌱" },
  { year: "The Best Times", note: "Воспоминания, которые мы навсегда сохраним в наших сердцах. 🕯️" },
  { year: "Today", note: "Мы чествуем ВАС — и всё, что вы собой представляете. 🎂" },
  { year: "The Future", note: "Впереди еще больше волшебства, радости и любви. ✨" },
]

interface VintagePageProps {
  visible: boolean
}

export default function VintagePage({ visible }: VintagePageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (visible && containerRef.current) {
      containerRef.current.style.opacity = '0'
      const t = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = 'opacity 1.8s ease'
          containerRef.current.style.opacity = '1'
        }
      }, 100)
      return () => clearTimeout(t)
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !videoRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {
            // Autoplay blocks might prevent playing if user hasn't interacted
          })
        } else {
          videoRef.current?.pause()
        }
      })
    }, { threshold: 0.5 })

    observer.observe(videoRef.current)

    return () => observer.disconnect()
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="vintage-page"
      style={{
        backgroundImage: `url('/images/parchment-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark parchment overlay for warmth */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(20, 10, 3, 0.12)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Burnt edges */}
      <div className="burnt-edge-top" />
      <div className="burnt-edge-bottom" />
      <div className="burnt-edge-left" />
      <div className="burnt-edge-right" />

      {/* Flower corner decorations */}
      <img
        src="/images/flowers-corner.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'fixed', top: 16, left: 16,
          width: 160, opacity: 0.65,
          pointerEvents: 'none', zIndex: 111,
          transform: 'rotate(-5deg)',
        }}
      />
      <img
        src="/images/flowers-corner.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'fixed', top: 16, right: 16,
          width: 160, opacity: 0.65,
          pointerEvents: 'none', zIndex: 111,
          transform: 'scaleX(-1) rotate(-5deg)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 100 }}>

        {/* ===== HERO ===== */}
        <section className="parchment-section" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 80,
          paddingBottom: 60,
        }}>
          <div className="ornamental-divider" style={{ marginBottom: 8 }}>✦ &nbsp; ✦ &nbsp; ✦</div>
          <p className="parchment-subtitle">A letter sealed with love, written just for you...</p>
          <h1 className="parchment-title">
            Happy Birthday,
            <span className="name-highlight">Dearest One</span>
          </h1>
          <div className="ornamental-divider">❧ &nbsp; ❧ &nbsp; ❧</div>
          <p className="parchment-lead">
            Вы открыли это письмо, перенесенное сквозь время на крыльях дружбы,
            скрепленное лентами любви и присыпанное теплом заветных воспоминаний,
            хоть близко и не знакомы.
            На этих страницах вы найдете слова, идущие прямо от сердца....
          </p>
          <div className="scroll-hint" aria-label="Scroll to read more">
            <span>Scroll to read on</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </section>

        {/* ===== POEM ===== */}
        <section className="parchment-section">
          <div className="parchment-card wide">
            <div className="ornamental-divider">⟡ &nbsp; A Poem For You &nbsp; ⟡</div>
            <div className="poem">
              <p>On this day the world was blessed,</p>
              <p>when you took your very first breath.</p>
              <p>Stars aligned and moonlight shone,</p>
              <p>for the universe had never known</p>
              <p>a soul so warm, a heart so true —</p>
              <p>the world grew richer knowing you.</p>
              <br />
              <p>So here we gather, ink to page,</p>
              <p>to mark this most beloved age,</p>
              <p>with words and wishes, love and cheer —</p>
              <p className="italic">Happy Birthday, year after year.</p>
            </div>
          </div>
        </section>

        {/* ===== PHOTO GRID ===== */}
        <section className="parchment-section" style={{ paddingTop: 30 }}>
          <h2 className="section-heading">Cherished Memories</h2>
          <div className="ornamental-divider">· &nbsp; · &nbsp; · &nbsp; · &nbsp; ·</div>
          <div className="photo-grid">
            {memories.map((mem, i) => (
              <div key={i} className="photo-frame-wrapper">
                <div className="photo-frame">
                  <img
                    src={`/images/${i + 1}.jpg`}
                    alt={mem.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: 'rgba(235, 220, 190, 0.6)' }}
                  />
                </div>
                <p className="photo-caption">{mem.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WISHES ===== */}
        <section className="parchment-section" style={{ paddingTop: 30 }}>
          <h2 className="section-heading">Words From the Heart</h2>
          <div className="ornamental-divider">❀ &nbsp; ❀ &nbsp; ❀</div>
          <div className="wishes-container">
            {wishes.map((wish) => (
              <div key={wish.id} className="wish-card">
                <div className="wish-quote">"</div>
                <p className="wish-text">{wish.text}</p>
                <p className="wish-author">{wish.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LARGE PHOTO ===== */}
        <section className="parchment-section" style={{ paddingTop: 30 }}>
          <div className="parchment-card wide">
            <div className="ornamental-divider">· &nbsp; · &nbsp; A Special Moment &nbsp; · &nbsp; ·</div>
            <div className="photo-frame" style={{ maxWidth: 700, margin: '0 auto', aspectRatio: 'auto', height: 'auto' }}>
              <video
                ref={videoRef}
                src="/images/5.mp4"
                controls
                playsInline
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: 'rgba(235, 220, 190, 0.6)' }}
              />
            </div>
            <p className="photo-caption center" style={{ marginTop: 22 }}>
              "A picture is worth a thousand words,<br />but your presence is worth a million smiles.<br />Мир меняется, а мы остаемся😁"
            </p>
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section className="parchment-section" style={{ paddingTop: 30 }}>
          <h2 className="section-heading">Through the Years</h2>
          <div className="ornamental-divider">· &nbsp; · &nbsp; · &nbsp; · &nbsp; ·</div>
          <div className="timeline">
            {timelineItems.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <span className="timeline-note">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECOND PHOTOS ROW ===== */}
        <section className="parchment-section" style={{ paddingTop: 30 }}>
          <h2 className="section-heading">More Beautiful Moments</h2>
          <div className="ornamental-divider">✦ &nbsp; ✦ &nbsp; ✦</div>
          <div className="photo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {['🌷 Ortak bir macera', '⛰️ Güzellik', '☀️ Mükemmel bir gün'].map((label, i) => (
              <div key={i} className="photo-frame-wrapper">
                <div className="photo-frame" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={`/images/${i + 6}.jpg`}
                    alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <p className="photo-caption">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CLOSING ===== */}
        <section className="parchment-section" style={{ paddingTop: 30, paddingBottom: 120 }}>
          <div className="parchment-card wide closing">
            <div className="ornamental-divider">✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="closing-title">With All My Love</h2>
            <p className="closing-text">
              Пусть этот день рождения принесет тебе все, чего желает твое сердце — каждую достижимую мечту, каждый миг,
              наполненный теплом, смехом и любовью тех, кто тебя больше всего ценит.
            </p>
            <p className="closing-text" style={{ marginTop: 22 }}>
              Ты — дар этому миру. Никогда, никогда не забывай об этом.
            </p>
            <div className="ornamental-divider" style={{ marginTop: 44 }}>❧</div>
            <p className="signature">Forever yours,</p>
            <p className="signature-name">Your Loving Friend<br />Begenç</p>
            <span className="wax-seal-icon" aria-label="Wax seal">🔴</span>
          </div>
        </section>

      </div>
    </div>
  )
}
