import { useEffect, useState } from 'react'

const BB_LABELS = {
  'Commit Purity':     { bb: 'Purity of the Product' },
  'Language Mastery':  { bb: 'Range of Chemicals Known' },
  'Repo Quality':      { bb: 'Lab Cleanliness' },
  'Community Rep':     { bb: 'Street Distribution Network' },
  'Heisenberg Factor': { bb: 'The Blue Sky Mystique' },
}

export default function StatBar({ label, value, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setWidth(value), delay + 100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [value, delay])

  const color = value >= 80 ? 'var(--green-neon)'
    : value >= 60 ? 'var(--green-bright)'
    : value >= 40 ? 'var(--orange)'
    : 'var(--red)'

  const meta = BB_LABELS[label] || { bb: label }

  return (
    <div style={{ marginBottom: '1rem', opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.3rem' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
          <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.6rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            {meta.bb}
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color, fontWeight: 700, minWidth: '2.5rem', textAlign: 'right' }}>
          {width}
        </span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: width > 0 ? `0 0 8px ${color}55` : 'none',
        }} />
      </div>
    </div>
  )
}
