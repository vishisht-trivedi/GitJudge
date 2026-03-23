import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Crown, ChevronRight, FlaskConical } from 'lucide-react'
import { soundClick, soundHover } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const RANK_COLORS = {
  'Heisenberg':    '#F5C518',
  'Cartel Boss':   '#E67E22',
  'Blue Sky Cook': '#62A854',
  'Street Dealer': '#8BC34A',
  'Jesse Pinkman': '#6B9BD2',
  "Saul's Client": '#C0392B',
}

export default function Leaderboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/leaderboard`)
      .then(r => r.json())
      .then(d => { setData(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fadein">
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Trophy size={32} color="var(--yellow)" strokeWidth={1.5} />
            THE <span style={{ color: 'var(--yellow)' }}>EMPIRE</span> RANKINGS
          </h1>
          <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            The best product rises to the top. Always.
          </p>
        </div>

        {loading ? (
          <div className="loading-screen" style={{ minHeight: '40vh' }}>
            <div className="loading-molecule" />
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>Loading rankings...</p>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <FlaskConical size={40} color="var(--muted)" strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--muted)', fontStyle: 'italic' }}>No one has been judged yet. Be the first.</p>
            <button className="btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Start Judging</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.map((profile, i) => {
              const rankColor = RANK_COLORS[profile.verdict?.cookRank] || 'var(--green-bright)'
              const isTop3 = i < 3
              return (
                <div key={profile.username}
                  className="card animate-fadein"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                    animationDelay: `${i * 0.05}s`,
                    borderColor: isTop3 ? `${rankColor}44` : 'rgba(42,64,24,0.8)',
                    background: isTop3 ? `rgba(13,26,8,0.9)` : 'rgba(13,26,8,0.78)',
                    padding: '0.85rem 1.25rem',
                  }}
                  onClick={() => { soundClick(); navigate(`/result/${profile.username}`) }}
                  onMouseEnter={soundHover}>

                  {/* Rank number */}
                  <div style={{
                    fontFamily: 'var(--font-title)', fontSize: isTop3 ? '1.4rem' : '1rem',
                    color: i === 0 ? '#F5C518' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted)',
                    minWidth: '2rem', textAlign: 'center', fontWeight: 700,
                  }}>
                    {i === 0 ? <Crown size={20} color="#F5C518" /> : `#${i + 1}`}
                  </div>

                  {/* Avatar */}
                  <img src={profile.githubData?.avatar_url} alt={profile.username}
                    style={{ width: isTop3 ? 44 : 36, height: isTop3 ? 44 : 36, border: `2px solid ${rankColor}`, filter: 'grayscale(10%)', flexShrink: 0 }} />

                  {/* Name + rank */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: isTop3 ? '1rem' : '0.9rem', color: 'var(--white)', marginBottom: '0.1rem' }}>
                      {profile.githubData?.name || profile.username}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>@{profile.username}</div>
                  </div>

                  {/* Cook rank */}
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: rankColor, letterSpacing: '0.05em', textAlign: 'right', flexShrink: 0 }}>
                    {profile.verdict?.cookRank}
                  </div>

                  {/* Score */}
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: isTop3 ? '1.5rem' : '1.2rem', color: rankColor, fontWeight: 700, minWidth: '3rem', textAlign: 'right', flexShrink: 0 }}>
                    {profile.verdict?.chemistryScore}
                  </div>

                  <ChevronRight size={14} color="var(--muted)" />
                </div>
              )
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '3rem' }}>
          <button className="btn" onClick={() => { soundClick(); navigate('/') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FlaskConical size={14} /> Judge a Developer
          </button>
        </div>
      </div>
    </div>
  )
}
