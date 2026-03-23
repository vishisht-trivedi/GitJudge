import { useState } from 'react'
import { Swords, FlaskConical, ArrowLeft, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CookRankBadge from '../components/CookRankBadge'
import StatBar from '../components/StatBar'
import { soundClick, soundSuccess, soundError } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Battle() {
  const navigate = useNavigate()
  const [u1, setU1] = useState('')
  const [u2, setU2] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleBattle = async (e) => {
    e.preventDefault()
    if (!u1.trim() || !u2.trim()) return
    soundClick()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API}/api/battle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username1: u1.trim(), username2: u2.trim() })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      soundSuccess()
    } catch (err) {
      setError(err.message)
      soundError()
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-molecule" />
      <h2 className="loading-logo"><span style={{ color: 'var(--orange)' }}>COOK-OFF</span> ARENA</h2>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--yellow)' }}>@{u1}</span> vs <span style={{ color: 'var(--orange)' }}>@{u2}</span>
      </p>
      <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.75rem' }}>Walter is judging the cook-off...</p>
    </div>
  )

  if (result) {
    const [d1, d2] = result.developers || []
    const winner = result.verdict?.winner
    return (
      <div className="container page-enter" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button className="btn" onClick={() => { soundClick(); setResult(null) }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> New Battle
          </button>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.15em' }}>
            COOK-OFF RESULTS
          </div>
        </div>

        {/* Winner banner */}
        {winner && (
          <div className="card animate-fadein" style={{ textAlign: 'center', marginBottom: '2rem', borderColor: 'rgba(245,197,24,0.3)', padding: '1.5rem' }}>
            <Crown size={32} color="var(--yellow)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>WINNER</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', color: 'var(--yellow)', fontWeight: 700 }}>@{winner}</div>
            {result.verdict?.verdict && (
              <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                {result.verdict.verdict}
              </p>
            )}
            {result.verdict?.quote && (
              <div style={{ borderLeft: '3px solid var(--yellow)', paddingLeft: '1rem', marginTop: '1rem', display: 'inline-block', textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--yellow)', fontStyle: 'italic' }}>"{result.verdict.quote}"</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.2rem' }}>— Heisenberg</p>
              </div>
            )}
          </div>
        )}

        {/* Side by side */}
        <div className="battle-grid">
          {[d1, d2].map((dev, idx) => dev && (
            <div key={dev.username} className={`card animate-fadein`} style={{ animationDelay: `${idx * 0.1}s`, borderColor: dev.username === winner ? 'rgba(245,197,24,0.4)' : 'rgba(98,168,84,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img src={dev.githubData?.avatar_url} alt={dev.username} style={{ width: 48, height: 48, border: `2px solid ${dev.username === winner ? 'var(--yellow)' : 'rgba(98,168,84,0.3)'}` }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--white)' }}>{dev.githubData?.name || dev.username}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>@{dev.username}</div>
                </div>
                {dev.username === winner && <Crown size={18} color="var(--yellow)" style={{ marginLeft: 'auto' }} />}
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <CookRankBadge rank={dev.verdict?.cookRank} score={dev.verdict?.chemistryScore} />
              </div>
              {dev.verdict?.stats && Object.entries({
                'Commit Purity': dev.verdict.stats.commitPurity,
                'Language Mastery': dev.verdict.stats.languageMastery,
                'Repo Quality': dev.verdict.stats.repoQuality,
                'Community Rep': dev.verdict.stats.communityRep,
                'Heisenberg Factor': dev.verdict.stats.heisenbergFactor,
              }).map(([label, val], i) => (
                <StatBar key={label} label={label} value={val} delay={i * 80} />
              ))}
              <button className="btn" onClick={() => { soundClick(); navigate(`/result/${dev.username}`) }}
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FlaskConical size={13} /> Full Profile
              </button>
            </div>
          ))}
          <div className="vs-divider">VS</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Swords size={28} color="var(--orange)" />
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            COOK-OFF <span style={{ color: 'var(--orange)' }}>ARENA</span>
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--muted)', fontStyle: 'italic' }}>
          Two developers enter. One product wins. No half measures.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleBattle} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>PLAYER 1</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', padding: '0.6rem 0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(98,168,84,0.3)', borderRight: 'none' }}>gh/</span>
              <input className="search-input" value={u1} onChange={e => setU1(e.target.value)} placeholder="username" style={{ borderRadius: 0 }} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--orange)', textAlign: 'center', textShadow: '0 0 20px rgba(230,126,34,0.5)' }}>VS</div>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>PLAYER 2</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', padding: '0.6rem 0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(98,168,84,0.3)', borderRight: 'none' }}>gh/</span>
              <input className="search-input" value={u2} onChange={e => setU2(e.target.value)} placeholder="username" style={{ borderRadius: 0 }} />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-yellow" disabled={!u1.trim() || !u2.trim()}
          style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem' }}>
          <Swords size={16} /> START THE COOK-OFF
        </button>
      </form>
    </div>
  )
}
