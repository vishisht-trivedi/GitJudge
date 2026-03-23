import { useEffect, useState } from 'react'
import { Crown, Star, Flame, Zap, User, AlertTriangle } from 'lucide-react'
import { soundSuccess } from '../utils/sounds'

const RANK_META = {
  'Heisenberg':    { color: '#F5C518', Icon: Crown,        desc: 'The one who knocks. Absolute mastery.' },
  'Cartel Boss':   { color: '#E67E22', Icon: Star,         desc: 'Running the empire. Serious product.' },
  'Blue Sky Cook': { color: '#62A854', Icon: Flame,        desc: 'High purity. Consistent output.' },
  'Street Dealer': { color: '#8BC34A', Icon: Zap,          desc: 'Getting there. Keep cooking.' },
  'Jesse Pinkman': { color: '#6B9BD2', Icon: User,         desc: 'Yeah science! But needs work.' },
  "Saul's Client": { color: '#C0392B', Icon: AlertTriangle, desc: 'Better call Saul. Immediately.' },
}

export default function CookRankBadge({ rank, score, large = false, animate = false }) {
  const [revealed, setRevealed] = useState(!animate)
  const meta = RANK_META[rank] || RANK_META["Saul's Client"]
  const { color, Icon, desc } = meta

  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => { setRevealed(true); soundSuccess() }, 300)
    return () => clearTimeout(t)
  }, [animate])

  return (
    <div style={{
      textAlign: 'center',
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'scale(1)' : 'scale(0.8)',
      transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: large ? 64 : 48,
        height: large ? 64 : 48,
        border: `2px solid ${color}`,
        marginBottom: '0.5rem',
        boxShadow: `0 0 20px ${color}44`,
        background: `${color}11`,
      }}>
        <Icon size={large ? 28 : 20} color={color} strokeWidth={1.5} />
      </div>
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: large ? '1.1rem' : '0.85rem',
        color,
        letterSpacing: '0.08em',
        marginBottom: '0.2rem',
      }}>
        {rank}
      </div>
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: large ? '1.8rem' : '1.3rem',
        color: 'var(--white)',
        fontWeight: 700,
        lineHeight: 1,
        marginBottom: '0.2rem',
      }}>
        {score}<span style={{ fontSize: '0.6em', color: 'var(--muted)' }}>/100</span>
      </div>
      {large && (
        <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic', maxWidth: 140 }}>
          {desc}
        </div>
      )}
    </div>
  )
}
