import { useEffect, useRef, useState } from 'react'

export default function CircularScore({ score = 0, label = '', size = 120, color = 'var(--green-neon)' }) {
  const [displayed, setDisplayed] = useState(0)
  const raf = useRef(null)
  const r = (size / 2) - 10
  const circ = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ

  useEffect(() => {
    const start = performance.now()
    const duration = 1000
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(ease * score))
      if (t < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [score])

  return (
    <div className="circular-score-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(98,168,84,0.12)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.05s' }} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          style={{
            fill: color,
            fontFamily: 'var(--font-title)',
            fontSize: size * 0.22,
            fontWeight: 700,
            transform: 'rotate(90deg)',
            transformOrigin: 'center'
          }}>
          {displayed}
        </text>
      </svg>
      {label && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          {label}
        </div>
      )}
    </div>
  )
}
