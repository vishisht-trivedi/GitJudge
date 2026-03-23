import { useState } from 'react'
import { Briefcase, FlaskConical, ArrowLeft, CheckCircle, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CircularScore from '../components/CircularScore'
import SkillsTable from '../components/SkillsTable'
import ActionPlan from '../components/ActionPlan'
import { soundClick, soundSuccess, soundError } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STEPS = [
  'Extracting required skills from job description...',
  'Checking your GitHub repos for evidence...',
  'Running cross-reference analysis...',
  'Walter is writing your verdict...',
]

export default function JobFit() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [roleName, setRoleName] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !jd.trim()) return
    soundClick()
    setLoading(true); setError(''); setResult(null); setStepIdx(0)
    const interval = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 1800)
    try {
      const res = await fetch(`${API}/api/jobfit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), jobDescription: jd.trim(), roleName: roleName.trim() })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setResult(json)
      soundSuccess()
    } catch (err) {
      setError(err.message)
      soundError()
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (!result) return
    const text = `GitJudge Job Fit — @${username}\nRole: ${result.verdict?.fitRank || ''}\nReadiness: ${result.readinessScore}%\n"${result.verdict?.quote || ''}"\n\nAction Plan:\n${result.verdict?.actionPlan?.map((s,i) => `${i+1}. ${s}`).join('\n') || ''}`
    navigator.clipboard.writeText(text).then(() => { setCopied(true); soundSuccess(); setTimeout(() => setCopied(false), 2500) })
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-molecule" />
      <h2 className="loading-logo">JOB<span style={{ color: 'var(--yellow)' }}>FIT</span></h2>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>
        Analyzing <span style={{ color: 'var(--yellow)' }}>@{username}</span>
      </p>
      <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {STEPS[stepIdx]}
      </p>
    </div>
  )

  if (result) return (
    <div className="page-enter container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn" onClick={() => { soundClick(); setResult(null) }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> New Analysis
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={14} /> {copied ? 'Copied!' : 'Share'}
          </button>
          <button className="btn" onClick={() => { soundClick(); navigate(`/result/${username}`) }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FlaskConical size={14} /> Full Profile
          </button>
        </div>
      </div>

      <div className="card card-glow animate-fadein" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
          JOB FIT ANALYSIS — @{result.username || username}
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--white)', marginBottom: '1.5rem' }}>
          {result.roleName || roleName || 'Role Analysis'}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <CircularScore score={result.readinessScore ?? 0} size={130} />
        </div>
        {result.verdict?.fitRank && (
          <div style={{ marginTop: '1rem', fontFamily: 'var(--font-title)', fontSize: '0.85rem', color: 'var(--green-neon)', letterSpacing: '0.1em' }}>
            {result.verdict.fitRank}
          </div>
        )}
      </div>

      {result.verdict?.verdictText && (
        <div className="card roast-card animate-fadein" style={{ marginBottom: '1.5rem', borderColor: 'rgba(245,197,24,0.25)', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Briefcase size={15} color="var(--yellow)" />
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--yellow)', fontSize: '0.9rem', letterSpacing: '0.12em' }}>WALTER'S VERDICT</h3>
          </div>
          <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{result.verdict.verdictText}</p>
          {result.verdict.quote && (
            <div style={{ borderLeft: '3px solid var(--yellow)', paddingLeft: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--yellow)', fontStyle: 'italic' }}>"{result.verdict.quote}"</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.2rem' }}>— Heisenberg</p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {result.skillMatches?.length > 0 && (
          <div className="card animate-slidein-l">
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> SKILL MATCH
            </h3>
            <SkillsTable skills={result.skillMatches.map(s => ({ name: s.skill, score: s.strength * 25, evidence: s.evidence }))} />
          </div>
        )}
        {result.verdict?.actionPlan?.length > 0 && (
          <div className="card animate-slidein-r">
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--yellow)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FlaskConical size={14} /> ACTION PLAN
            </h3>
            <ActionPlan steps={result.verdict.actionPlan.map(s => ({ detail: s }))} />
          </div>
        )}
      </div>

      {result.skillMatches?.filter(s => s.status === 'missing').length > 0 && (
        <div className="card animate-fadein" style={{ marginBottom: '2rem', animationDelay: '0.3s' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--orange)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>GAPS TO CLOSE</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {result.skillMatches.filter(s => s.status === 'missing').map(s => (
              <span key={s.skill} className="tag-pill" style={{ borderColor: 'rgba(255,140,0,0.3)', color: 'var(--orange)' }}>{s.skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="jf-input-card card card-glow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Briefcase size={18} color="var(--green-neon)" />
          <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', fontSize: '1.3rem', letterSpacing: '0.1em' }}>JOB FIT ANALYZER</h2>
        </div>
        <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1.75rem', fontStyle: 'italic' }}>
          Paste a job description. We cross-reference it against real GitHub evidence and tell you exactly where you stand.
        </p>
        {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.6rem 0.85rem', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>GITHUB USERNAME</label>
              <input className="search-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. torvalds" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>JOB ROLE (OPTIONAL)</label>
              <input className="search-input" value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="e.g. Senior Backend Engineer" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>JOB DESCRIPTION</label>
            <textarea className="jf-textarea" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." />
          </div>
          <button type="submit" className="btn btn-yellow" disabled={!username.trim() || !jd.trim()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}>
            <Briefcase size={15} /> Analyze Fit
          </button>
        </form>
      </div>
    </div>
  )
}
