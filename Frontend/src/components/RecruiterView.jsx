import { ExternalLink, CheckCircle, AlertTriangle, Star, GitBranch, Share2 } from 'lucide-react'

function ProjectCard({ project, index }) {
  if (!project) return null
  return (
    <div className="proj-card card" style={{ animation: `fadeUp 0.4s ease ${index * 0.1}s both` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--white)', marginBottom: '0.2rem' }}>{project.name}</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {project.language && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--green-bright)', border: '1px solid rgba(139,195,74,0.3)', padding: '0.1rem 0.4rem' }}>{project.language}</span>}
            {project.stargazers_count > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={10} /> {project.stargazers_count}</span>}
          </div>
        </div>
        {project.projectType && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', border: '1px solid rgba(42,64,24,0.8)', padding: '0.1rem 0.4rem' }}>{project.projectType}</span>}
      </div>
      {project.summary && <p style={{ fontFamily: 'var(--font-worn)', fontSize: '0.82rem', color: 'var(--white)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '0.5rem' }}>{project.summary}</p>}
      {project.useCase && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>{project.useCase}</p>}
      {project.techStack?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {project.techStack.slice(0, 5).map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--green-bright)', background: 'rgba(98,168,84,0.08)', border: '1px solid rgba(98,168,84,0.2)', padding: '0.1rem 0.4rem' }}>{t}</span>)}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a href={`https://github.com/${project.full_name || project.name}`} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: '0.7rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <GitBranch size={11} /> View Repo
        </a>
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-yellow" style={{ fontSize: '0.7rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={11} /> Live Demo</a>}
      </div>
    </div>
  )
}

function FlagsPanel({ green, red }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
      <div className="card recruiter-section">
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-bright)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={14} /> GREEN FLAGS
        </h3>
        {green.length === 0 && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>None detected.</p>}
        {green.map((f, i) => (
          <div key={i} style={{ marginBottom: '0.75rem', animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--green-bright)', marginBottom: '0.15rem' }}>{f.title}</div>
            <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.68rem', color: 'var(--muted)', fontStyle: 'italic' }}>{f.detail}</div>
          </div>
        ))}
      </div>
      <div className="card recruiter-section">
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--orange)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={14} /> RED FLAGS
        </h3>
        {red.length === 0 && <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>None detected.</p>}
        {red.map((f, i) => (
          <div key={i} style={{ marginBottom: '0.75rem', animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', marginBottom: '0.15rem' }}>{f.title}</div>
            <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.68rem', color: 'var(--muted)', fontStyle: 'italic' }}>{f.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecruiterReport({ verdict, greenCount, redCount }) {
  if (!verdict) return null
  const gradeColor = verdict.hireGrade?.startsWith('A') ? 'var(--green-neon)' : verdict.hireGrade === 'B' ? 'var(--yellow)' : verdict.hireGrade === 'C' ? 'var(--orange)' : 'var(--red)'
  const resumeMatch = Math.round((greenCount / Math.max(greenCount + redCount, 1)) * 100)

  return (
    <div className="card recruiter-section" style={{ borderColor: 'rgba(245,197,24,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.7rem', color: 'var(--yellow)', border: '1px solid var(--yellow)', padding: '0.1rem 0.4rem', letterSpacing: '0.1em' }}>W.W.</div>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--yellow)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>RECRUITER INTELLIGENCE REPORT</h3>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Hire Grade',     value: verdict.hireGrade,                        color: gradeColor },
          { label: 'Resume Match',   value: resumeMatch + '%',                         color: 'var(--green-bright)' },
          { label: 'Green Flags',    value: greenCount,                                color: 'var(--green-neon)' },
          { label: 'Red Flags',      value: redCount,                                  color: redCount > 3 ? 'var(--red)' : 'var(--orange)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '0.75rem', border: '1px solid rgba(42,64,24,0.8)', background: 'rgba(13,26,8,0.5)' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color, fontWeight: 700, lineHeight: 1 }}>{value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.3rem', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--white)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{verdict.verdictText}</p>
      <div style={{ borderLeft: '3px solid var(--yellow)', paddingLeft: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-worn)', color: 'var(--yellow)', fontStyle: 'italic', fontSize: '0.88rem' }}>"{verdict.oneLineVerdict}"</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.2rem' }}>— Heisenberg</p>
      </div>
    </div>
  )
}

export default function RecruiterView({ data, loading, username, onShare }) {
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(98,168,84,0.15)', marginTop: '1.5rem' }}>
      <div className="loading-molecule" style={{ margin: '0 auto 1rem' }} />
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-bright)', fontSize: '0.85rem' }}>Preparing recruiter report...</p>
      <div className="loading-bar-track" style={{ maxWidth: 300, margin: '1rem auto' }}><div className="loading-bar-fill" /></div>
    </div>
  )
  if (!data) return null

  const greenCount = data.green?.length || 0
  const redCount = data.red?.length || 0

  return (
    <div style={{ borderTop: '1px solid rgba(98,168,84,0.15)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
          RECRUITER INTELLIGENCE — AI ANALYSIS
        </h2>
        {onShare && (
          <button className="btn" onClick={onShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <Share2 size={12} /> Share Recruiter Report
          </button>
        )}
      </div>
      {data.topProjects?.length > 0 && (
        <div className="recruiter-section" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--green-neon)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={14} /> BEST PROJECTS — AI SUMMARIZED FROM READMES
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {data.topProjects.map((p, i) => <ProjectCard key={p.name || i} project={p} index={i} />)}
          </div>
        </div>
      )}
      <div className="recruiter-section" style={{ marginBottom: '1.5rem' }}>
        <FlagsPanel green={data.green || []} red={data.red || []} />
      </div>
      <RecruiterReport verdict={data.recruiterVerdict} greenCount={greenCount} redCount={redCount} />
    </div>
  )
}
