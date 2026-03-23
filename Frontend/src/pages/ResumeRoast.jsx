import { useState } from 'react'
import { Upload, FileText, Loader, AlertCircle, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import CircularScore from '../components/CircularScore'
import ActionPlan from '../components/ActionPlan'
import { soundClick, soundSuccess, soundError } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STEPS = [
  'Extracting text from PDF...',
  'Fetching GitHub profile...',
  'Analyzing resume claims with AI...',
  'Cross-referencing with GitHub repos...',
  "Generating Walter's fraud verdict...",
]

const STATUS_CFG = {
  verified:   { Icon: CheckCircle,   color: 'var(--green-neon)',   label: 'VERIFIED' },
  partial:    { Icon: AlertTriangle, color: 'var(--yellow)',       label: 'PARTIAL' },
  unverified: { Icon: XCircle,       color: 'var(--red)',          label: 'NO EVIDENCE' },
}

function ClaimTable({ claims }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(98,168,84,0.2)' }}>
            {['CLAIM', 'SKILL', 'STATUS', 'EVIDENCE'].map(h => (
              <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--yellow)', fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {claims.map((c, i) => {
            const cfg = STATUS_CFG[c.status] || STATUS_CFG.unverified
            const { Icon } = cfg
            return (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(98,168,84,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--white)', maxWidth: '200px' }}>{c.claim}</td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--green-bright)' }}>{c.skill}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: `${cfg.color}18`, border: `1px solid ${cfg.color}55`, color: cfg.color, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    <Icon size={11} />{cfg.label}
                  </span>
                </td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--muted)', fontSize: '0.72rem' }}>{c.evidence}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ResumeRoast() {
  const [view, setView] = useState('upload')
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState('')
  const [roleName, setRoleName] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setError('') }
    else setError('Only PDF files are accepted')
  }

  const handleSubmit = async () => {
    if (!file || !username.trim()) { setError('Upload a PDF and enter your GitHub username'); return }
    soundClick()
    setError('')
    setView('loading')
    setLoadingStep(0)

    const fd = new FormData()
    fd.append('resume', file)
    fd.append('username', username.trim())
    if (roleName.trim()) fd.append('roleName', roleName.trim())

    const interval = setInterval(() => setLoadingStep(p => Math.min(p + 1, STEPS.length - 1)), 2200)
    try {
      const res = await fetch(`${API}/api/resumeroast`, { method: 'POST', body: fd })
      clearInterval(interval)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
      setView('results')
      soundSuccess()
    } catch (err) {
      clearInterval(interval)
      setError(err.message)
      setView('upload')
      soundError()
    }
  }

  const verdictColor = (v) => {
    if (!v) return 'var(--muted)'
    if (v === 'FRAUDULENT') return 'var(--red)'
    if (v === 'SUSPICIOUS') return 'var(--orange)'
    if (v === 'PARTIAL')    return 'var(--yellow)'
    if (v === 'HONEST')     return 'var(--green-bright)'
    return 'var(--green-neon)'
  }

  if (view === 'loading') return (
    <div className="loading-screen">
      <div className="loading-molecule" />
      <h2 className="loading-logo">RESUME <span style={{ color: 'var(--red)' }}>ROAST</span></h2>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>
        Analyzing <span style={{ color: 'var(--yellow)' }}>{file?.name}</span>
      </p>
      <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', width: '100%', maxWidth: '360px' }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: i <= loadingStep ? 1 : 0.3, transition: 'opacity 0.4s' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < loadingStep ? 'var(--green-neon)' : i === loadingStep ? 'var(--yellow)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--black)', fontWeight: 700, flexShrink: 0 }}>
              {i < loadingStep ? '✓' : i + 1}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: i === loadingStep ? 'var(--white)' : 'var(--muted)' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (view === 'results' && result) return (
    <div className="container page-enter" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => { soundClick(); setView('upload'); setResult(null) }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> New Analysis
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
          RESUME ROAST — @{result.username}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Score + Verdict */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card card-glow" style={{ textAlign: 'center', padding: '2rem' }}>
            <CircularScore score={result.matchScore} label="MATCH SCORE" />
            <div style={{ marginTop: '1rem', fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: verdictColor(result.verdict?.verdict), letterSpacing: '0.1em', fontWeight: 700 }}>
              {result.verdict?.verdict}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Fraud Score: {result.verdict?.fraudScore}/100
            </div>
          </div>

          <div className="card roast-card">
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>WALTER'S VERDICT</div>
            <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--yellow)', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              "{result.verdict?.walterQuote}"
            </p>
            <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '0.88rem', lineHeight: 1.7 }}>
              {result.verdict?.roastText}
            </p>
          </div>
        </div>

        {/* Action plan + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--green-neon)', letterSpacing: '0.15em', marginBottom: '1rem' }}>PROFILE STATS</div>
            {[
              { label: 'Top Skills', value: result.topSkills?.slice(0,5).join(', ') || '—' },
              { label: 'GitHub Repos', value: result.githubStats?.totalRepos },
              { label: 'Top Languages', value: result.githubStats?.topLanguages?.slice(0,4).join(', ') || '—' },
              { label: 'Followers', value: result.githubStats?.followers },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)' }}>{value}</span>
              </div>
            ))}
          </div>

          {result.verdict?.actionPlan?.length > 0 && (
            <div className="card">
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.15em', marginBottom: '1rem' }}>ACTION PLAN</div>
              <ActionPlan steps={result.verdict.actionPlan.map(s => ({ detail: s }))} />
            </div>
          )}
        </div>
      </div>

      {/* Claims table */}
      {result.claims?.length > 0 && (
        <div className="card animate-fadein" style={{ animationDelay: '0.2s' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            CLAIM VERIFICATION — {result.claims.length} CLAIMS ANALYZED
          </div>
          <ClaimTable claims={result.claims} />
        </div>
      )}
    </div>
  )

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <FileText size={28} color="var(--red)" />
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            RESUME <span style={{ color: 'var(--red)' }}>ROAST</span>
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--muted)', fontStyle: 'italic' }}>
          Upload your resume. Walter White will cross-reference every claim against your GitHub.
        </p>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {/* Drop zone */}
        <div
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('pdf-input').click()}
          style={{
            border: `2px dashed ${file ? 'var(--green-neon)' : 'rgba(98,168,84,0.3)'}`,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: file ? 'rgba(57,255,20,0.03)' : 'rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
            marginBottom: '1rem',
          }}
        >
          <input id="pdf-input" type="file" accept=".pdf" onChange={e => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
          {file ? (
            <>
              <FileText size={40} color="var(--green-neon)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-neon)', fontSize: '0.9rem', fontWeight: 600 }}>{file.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.3rem' }}>Click to change</div>
            </>
          ) : (
            <>
              <Upload size={40} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Drag & drop your resume PDF</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.75rem' }}>or click to browse</div>
            </>
          )}
        </div>

        <input className="search-input" value={username} onChange={e => setUsername(e.target.value)}
          placeholder="GitHub Username" style={{ marginBottom: '0.75rem' }} />
        <input className="search-input" value={roleName} onChange={e => setRoleName(e.target.value)}
          placeholder="Role Name (optional)" style={{ marginBottom: '1.25rem' }} />

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', marginBottom: '1rem' }}>
            <AlertCircle size={16} color="var(--red)" />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontSize: '0.8rem' }}>{error}</span>
          </div>
        )}

        <button onClick={handleSubmit} disabled={!file || !username.trim()}
          className={`btn ${file && username.trim() ? 'btn-red' : ''}`}
          style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem', fontSize: '0.9rem', letterSpacing: '0.12em', opacity: file && username.trim() ? 1 : 0.4 }}>
          <FileText size={16} /> ROAST MY RESUME
        </button>
      </div>
    </div>
  )
}
