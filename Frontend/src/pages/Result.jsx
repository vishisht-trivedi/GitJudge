import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Swords, RotateCcw, ExternalLink, FlaskConical, Microscope, Trophy, Briefcase } from 'lucide-react'
import StatBar from '../components/StatBar'
import CookRankBadge from '../components/CookRankBadge'
import RadarChart from '../components/RadarChart'
import RecruiterView from '../components/RecruiterView'
import { soundSuccess, soundClick, soundError, soundHover } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const WW_QUOTES = [
  'Synthesizing the product...',
  'Running the formula...',
  'Checking lab results...',
  'Walter is judging...',
  'Analyzing the chemistry...',
  'Cooking the data...',
  'No half measures...',
]

const BB_LORE = {
  'Heisenberg':    { quote: 'You clearly do not know who you are talking to. Let me clue you in.', ep: 'S4E6 — Cornered' },
  'Cartel Boss':   { quote: 'I am not in the meth business. I am in the empire business.', ep: 'S5E1 — Live Free or Die' },
  'Blue Sky Cook': { quote: 'Yeah, science!', ep: 'S1E1 — Pilot' },
  'Street Dealer': { quote: 'This is not meth.', ep: 'S1E1 — Pilot' },
  'Jesse Pinkman': { quote: 'Yeah Mr. White! Yeah science!', ep: 'S1E1 — Pilot' },
  "Saul's Client": { quote: 'Better call Saul!', ep: 'S2E8 — Better Call Saul' },
}

export default function Result() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)
  const [copied, setCopied] = useState(false)
  const [recruiterCopied, setRecruiterCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [recruiterMode, setRecruiterMode] = useState(false)
  const [recruiterData, setRecruiterData] = useState(null)
  const [recruiterLoading, setRecruiterLoading] = useState(false)

  const doFetch = (user) => {
    setLoading(true); setError(''); setRevealed(false)
    setRecruiterMode(false); setRecruiterData(null)
    fetch(`${API}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user })
    })
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        setData(json)
        setLoading(false)
        setTimeout(() => { setRevealed(true); soundSuccess() }, 200)
      })
      .catch(e => { setError(e.message); setLoading(false); soundError() })
  }

  useEffect(() => { doFetch(username) }, [username])

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => { setQuoteIdx(i => (i + 1) % WW_QUOTES.length); setQuoteFade(true) }, 300)
    }, 1800)
    return () => clearInterval(t)
  }, [loading])

  const handleRecruiterToggle = async () => {
    const newState = !recruiterMode
    setRecruiterMode(newState)
    if (newState && !recruiterData) {
      setRecruiterLoading(true)
      try {
        const res = await fetch(`${API}/api/recruiter/${username}`, { method: 'POST' })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        setRecruiterData(json)
      } catch (err) {
        console.error('Recruiter error:', err.message)
      } finally {
        setRecruiterLoading(false)
      }
    }
  }

  const handleShare = () => {
    if (!data) return
    const text = `GitJudge Verdict for @${data.username}\nCook Rank: ${data.verdict.cookRank}\nChemistry Score: ${data.verdict.chemistryScore}/100\n"${data.verdict.quote}"\n\n${data.verdict.roastText}`
    navigator.clipboard.writeText(text).then(() => { setCopied(true); soundSuccess(); setTimeout(() => setCopied(false), 2500) })
  }

  const handleShareRecruiter = () => {
    if (!recruiterData) return
    const v = recruiterData.recruiterVerdict
    const green = recruiterData.green?.map(f => f.title).join(', ') || 'none'
    const red = recruiterData.red?.map(f => f.title).join(', ') || 'none'
    const text = `GitJudge Recruiter Report — @${username}\nHire Grade: ${v?.hireGrade}\nRecommendation: ${v?.recommendation}\n"${v?.oneLineVerdict}"\n\nGreen Flags: ${green}\nRed Flags: ${red}`
    navigator.clipboard.writeText(text).then(() => { setRecruiterCopied(true); soundSuccess(); setTimeout(() => setRecruiterCopied(false), 2500) })
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-molecule" />
      <h2 className="loading-logo">GIT<span style={{ color: 'var(--yellow)' }}>JUDGE</span></h2>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>
        Analyzing <span style={{ color: 'var(--yellow)' }}>@{username}</span>
      </p>
      <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
      <p className="loading-quote" style={{ opacity: quoteFade ? 1 : 0 }}>{WW_QUOTES[quoteIdx]}</p>
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
      <p style={{ color: 'var(--red)', fontFamily: 'var(--font-worn)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>The lab has failed.</p>
      <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{error}</p>
      <button className="btn" onClick={() => navigate('/')}>Back to the Lab</button>
    </div>
  )

  if (!data) return null
  const { githubData: gh, verdict: v } = data
  const lore = BB_LORE[v.cookRank] || BB_LORE["Saul's Client"]

  return (
    <div className="page-enter container" style={{ padding: '2rem 1.5rem' }}>
      {/* Action bar */}
      <div className="animate-fadein-d" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn" onClick={() => { soundClick(); navigate('/') }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> New Analysis
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={14} /> {copied ? 'Copied!' : 'Share'}
          </button>
          <button className="btn btn-yellow" onClick={() => { soundClick(); navigate('/battle') }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Swords size={14} /> Challenge
          </button>
          <button className="btn" onClick={() => doFetch(username)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={14} /> Re-Analyze
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="card card-glow profile-card animate-fadein" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <img src={gh.avatar_url} alt={gh.name}
          style={{ width: 90, height: 90, border: '3px solid var(--green-bright)', display: 'block', filter: 'grayscale(20%)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: 'var(--white)', marginBottom: '0.2rem' }}>{gh.name}</h2>
          <p style={{ color: 'var(--green-bright)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            @{data.username}
            <a href={`https://github.com/${data.username}`} target="_blank" rel="noreferrer"
              style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}>
              <ExternalLink size={11} /> GitHub
            </a>
            {data.fromCache && <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>cached</span>}
          </p>
          {gh.bio && <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.75rem', fontFamily: 'var(--font-worn)', fontStyle: 'italic' }}>{gh.bio}</p>}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['Repos', gh.public_repos], ['Followers', gh.followers?.toLocaleString()], ['Stars', gh.total_stars?.toLocaleString()], ['Languages', gh.top_languages?.length]].map(([k, val]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div className="stat-number" style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--green-neon)' }}>{val ?? 0}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.5s' }}>
            <CookRankBadge rank={v.cookRank} score={v.chemistryScore} large animate={revealed} />
          </div>
          {/* Recruiter Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={handleRecruiterToggle}>
            <div style={{
              width: 44, height: 24,
              background: recruiterMode ? 'var(--green-mid)' : 'rgba(42,64,24,0.8)',
              borderRadius: 12, position: 'relative', transition: 'background 0.3s', border: '1px solid rgba(98,168,84,0.3)'
            }}>
              <div style={{
                position: 'absolute', top: 3, left: recruiterMode ? 23 : 3,
                width: 16, height: 16,
                background: recruiterMode ? '#fff' : 'var(--muted)',
                borderRadius: '50%', transition: 'all 0.3s'
              }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: recruiterMode ? 'var(--green-bright)' : 'var(--muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Briefcase size={11} /> Recruiter Mode
            </span>
          </div>
        </div>
      </div>

      {/* BB Lore */}
      <div className="lore-card animate-fadein" style={{ marginBottom: '1.5rem', animationDelay: '0.1s' }}>
        <div className="lore-speaker">BREAKING BAD · {lore.ep}</div>
        {lore.quote}
      </div>

      {/* Roast card */}
      <div className="card roast-card animate-fadein" style={{ marginBottom: '1.5rem', borderColor: 'rgba(245,197,24,0.25)', animationDelay: '0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FlaskConical size={16} color="var(--yellow)" />
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--yellow)', fontSize: '0.95rem', letterSpacing: '0.12em' }}>WALTER'S VERDICT</h3>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', border: '1px solid rgba(245,197,24,0.2)', padding: '0.1rem 0.4rem' }}>
            {v.verdict}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>{v.roastText}</p>
        <div style={{ borderLeft: '3px solid var(--yellow)', paddingLeft: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--yellow)', fontSize: '0.95rem', fontStyle: 'italic' }}>"{v.quote}"</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.3rem' }}>— Heisenberg</p>
        </div>
      </div>

      {/* Tags */}
      <div className="animate-fadein" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', animationDelay: '0.3s' }}>
        {v.tags?.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
      </div>

      {/* Stats + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card animate-slidein-l">
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', marginBottom: '1.25rem', fontSize: '0.85rem', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FlaskConical size={14} /> CHEMISTRY BREAKDOWN
          </h3>
          <StatBar label="Commit Purity"     value={v.stats.commitPurity}     delay={200} />
          <StatBar label="Language Mastery"  value={v.stats.languageMastery}  delay={350} />
          <StatBar label="Repo Quality"      value={v.stats.repoQuality}      delay={500} />
          <StatBar label="Community Rep"     value={v.stats.communityRep}     delay={650} />
          <StatBar label="Heisenberg Factor" value={v.stats.heisenbergFactor} delay={800} />
        </div>
        <div className="card animate-slidein-r" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Microscope size={14} /> DEVELOPER PROFILE
          </h3>
          <RadarChart stats={v.stats} />
        </div>
      </div>

      {/* Languages */}
      {gh.top_languages?.length > 0 && (
        <div className="card animate-fadein" style={{ marginBottom: '1.5rem', animationDelay: '0.4s' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
            CHEMICAL COMPOSITION — LANGUAGES
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {gh.top_languages.map((lang, i) => (
              <div key={lang} className="element-box" onMouseEnter={soundHover}>
                <div className="atomic-num">{i + 1}</div>
                <div className="symbol" style={{ fontSize: '0.75rem' }}>{lang.slice(0, 2).toUpperCase()}</div>
                <div className="name">{lang}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most starred */}
      {gh.most_starred_repo && (
        <div className="card animate-fadein" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: '0.5s' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>BEST PRODUCT (MOST STARRED)</div>
            <div style={{ fontFamily: 'var(--font-title)', color: 'var(--white)', fontSize: '1.1rem' }}>{gh.most_starred_repo}</div>
          </div>
          <a href={`https://github.com/${data.username}/${gh.most_starred_repo}`} target="_blank" rel="noreferrer"
            className="btn" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ExternalLink size={13} /> View Repo
          </a>
        </div>
      )}

      {/* Recruiter View */}
      {recruiterMode && (
        <RecruiterView
          data={recruiterData}
          loading={recruiterLoading}
          username={username}
          onShare={recruiterData ? handleShareRecruiter : null}
        />
      )}
      {recruiterCopied && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--smoke3)', border: '1px solid var(--green-bright)', color: 'var(--green-bright)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.6rem 1rem', zIndex: 999 }}>
          Recruiter report copied!
        </div>
      )}

      {/* CTA */}
      <div className="animate-fadein" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '3rem', paddingTop: '1rem', animationDelay: '0.6s' }}>
        <button className="btn btn-yellow" onClick={() => { soundClick(); navigate('/battle') }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Swords size={14} /> Battle Another Dev
        </button>
        <button className="btn" onClick={() => { soundClick(); navigate('/leaderboard') }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trophy size={14} /> See Leaderboard
        </button>
        <button className="btn" onClick={() => { soundClick(); navigate('/job-fit') }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={14} /> Check Job Fit
        </button>
      </div>
    </div>
  )
}
