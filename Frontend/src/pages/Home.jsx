import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, Swords, Trophy, Briefcase, FileText } from 'lucide-react'
import { soundClick, soundError } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ELEMENTS = [
  ['35','Br','Bromine'],['56','Ba','Barium'],['79','Au','Gold'],
  ['80','Hg','Mercury'],['84','Po','Polonium'],['19','K','Potassium'],
  ['47','Ag','Silver'],['6','C','Carbon'],
]

const FEATURES = [
  { Icon: FlaskConical, color: 'var(--green-bright)', title: 'Chemistry Score', desc: '5-dimension scoring across commits, languages, quality, community, and the Heisenberg Factor.' },
  { Icon: FlaskConical, color: 'var(--orange)',       title: 'AI Roast',        desc: 'Gemini judges your code habits as Walter White. Ruthless. Accurate. Darkly funny.' },
  { Icon: Swords,       color: 'var(--red)',          title: 'Battle Mode',     desc: 'Head-to-head dev cook-off. Two usernames enter. One product wins. No half measures.' },
  { Icon: Trophy,       color: 'var(--yellow)',       title: 'Leaderboard',     desc: 'Top chemistry scores across all judged developers. See who runs the empire.' },
]

const QUOTES = [
  { char: 'WALTER WHITE',    text: 'You asked me if I was in the danger. I am the danger.' },
  { char: 'HEISENBERG',      text: 'Say my name. You are goddamn right.' },
  { char: 'MIKE EHRMANTRAUT',text: 'No more half measures, Walter.' },
]

const EXAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'tj', 'yyx990803']

export default function Home() {
  const [username, setUsername] = useState('')
  const [recent, setRecent] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/leaderboard?limit=5`)
      .then(r => r.json())
      .then(d => setRecent(d.profiles || []))
      .catch(() => {})
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const u = username.trim()
    if (!u) return
    soundClick()
    navigate(`/result/${u}`)
  }

  return (
    <div className="home-hero">
      {/* Periodic table row */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {ELEMENTS.map(([num, sym, name]) => (
          <div key={sym} className="element-box" style={{ minWidth: '52px' }}>
            <div className="atomic-num">{num}</div>
            <div className="symbol">{sym}</div>
            <div className="name">{name}</div>
          </div>
        ))}
      </div>

      {/* Title */}
      <h1 className="home-title">
        <span style={{ color: 'var(--white)' }}>GIT</span>
        <span style={{ color: 'var(--yellow)' }}>JUDGE</span>
      </h1>
      <p className="home-subtitle">Say. My. Name.</p>
      <p className="home-tagline">"I am the one who codes."</p>

      {/* Search */}
      <form onSubmit={handleSubmit} className="home-search-row">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', padding: '0.75rem 0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(98,168,84,0.3)', borderRight: 'none', whiteSpace: 'nowrap' }}>
          github.com/
        </span>
        <input
          className="search-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          style={{ borderRadius: 0, borderRight: 'none' }}
          autoFocus
        />
        <button type="submit" className="btn" style={{ padding: '0.75rem 1.25rem', borderRadius: 0 }}>
          JUDGE
        </button>
      </form>

      {/* Example usernames */}
      <div className="home-try-row">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>Try:</span>
        {EXAMPLES.map(u => (
          <button key={u} onClick={() => { soundClick(); navigate(`/result/${u}`) }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--green-bright)', background: 'rgba(98,168,84,0.06)', border: '1px solid rgba(98,168,84,0.2)', padding: '0.2rem 0.6rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-neon)'; e.currentTarget.style.color = 'var(--green-neon)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(98,168,84,0.2)'; e.currentTarget.style.color = 'var(--green-bright)' }}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="home-features">
        {FEATURES.map(({ Icon, color, title, desc }) => (
          <div key={title} className="feature-card">
            <Icon size={28} color={color} style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.95rem', color, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Recently judged */}
      {recent.length > 0 && (
        <div style={{ width: '100%', maxWidth: '900px', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.75rem', textAlign: 'left' }}>
            RECENTLY JUDGED
          </div>
          <div className="recently-judged">
            {recent.map(p => (
              <div key={p.username} className="judged-chip" onClick={() => { soundClick(); navigate(`/result/${p.username}`) }}>
                <img src={p.githubData?.avatar_url} alt={p.username} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(98,168,84,0.3)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--white)' }}>@{p.username}</span>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--green-neon)', fontWeight: 700 }}>{p.verdict?.chemistryScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BB Quotes */}
      <div className="home-quotes">
        {QUOTES.map(({ char, text }) => (
          <div key={char} className="quote-block">
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>{char}</div>
            <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.85rem', color: 'var(--white)', lineHeight: 1.6 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
