import { useEffect, useState } from 'react'
import StarField from './StarField'
import ParticleField from './ParticleField'

interface CountdownTimerProps {
    targetDate: Date;
    onComplete: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(() => Math.max(0, targetDate.getTime() - new Date().getTime()));

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const diff = targetDate.getTime() - now

            if (diff <= 0) {
                clearInterval(timer)
                onComplete()
            } else {
                setTimeLeft(diff)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate, onComplete])

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return (
        <div className="countdown-screen">
            {/* Deep space background */}
            <div className="bg-gradient" />
            <div className="nebula nebula-1" />
            <div className="nebula nebula-2" />
            <div className="nebula nebula-3" />
            <StarField />
            <ParticleField count={100} />

            <div className="countdown-content ui-overlay" style={{ justifyContent: 'center' }}>
                <div className="ornamental-divider">✦ ✦ ✦</div>
                <h1 className="countdown-title">Магия откроется через...</h1>

                <div className="countdown-timer">
                    <div className="time-block">
                        <span className="time-value">{days}</span>
                        <span className="time-label">Дней</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{hours.toString().padStart(2, '0')}</span>
                        <span className="time-label">Часов</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{minutes.toString().padStart(2, '0')}</span>
                        <span className="time-label">Минут</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{seconds.toString().padStart(2, '0')}</span>
                        <span className="time-label">Секунд</span>
                    </div>
                </div>

                <p className="countdown-subtitle">Ждем 22 июня ✨</p>
                <div className="ornamental-divider" style={{ marginTop: '40px' }}>✦ ✦ ✦</div>
            </div>
            <div className="vignette" />
        </div>
    )
}
