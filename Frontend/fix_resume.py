content = r'''import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react'
import CircularScore from '../components/CircularScore'
import ClaimTable from '../components/ClaimTable'
import ActionPlan from '../components/ActionPlan'
import { soundClick } from '../utils/sounds'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ResumeRoast() {
  const [view, setView] = useState('upload')
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState('')
  const [roleName, setRoleName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const steps = [
    'Extracting text from PDF...',
    'Fetching GitHub profile...',
    'Analyzing resume claims...',
    'Cross-referencing with GitHub...',
    "Generating Walter's verdict..."
  ]

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Only PDF files are accepted')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Only PDF files are accepted')
    }
  }

  const handleSubmit = async () => {
    if (!file || !username.trim()) {
      setError('Please upload a PDF and enter GitHub username')
      return
    }
    soundClick()
    setLoading(true)
    setError('')
    setView('loading')
    setLoadingStep(0)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('username', username.trim())
    if (roleName.trim()) formData.append('roleName', roleName.trim())

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, steps.length - 1))
    }, 2000)

    try {
      const res = await fetch(`${API}/api/resumeroast`, { method: 'POST', body: formData })
      clearInterval(stepInterval)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
      setView('results')
    } catch (err) {
      clearInterval(stepInterval)
      setError(err.message)
      setView('upload')
    } finally {
      setLoading(false)
    }
  }

  const fraudGrade = (score) => {
    if (score >= 90) return { label: 'FRAUDULENT', color: 'var(--red)' }
    if (score >= 70) return { label: 'SUSPICIOUS', color: 'var(--orange)' }
    if (score >= 40) return { label: 'PARTIAL', color: 'var(--yellow)' }
    if (score >= 20) return { label: 'HONEST', color: 'var(--green-neon)' }
    return { label: 'EXEMPLARY', color: 'var(--green-bright)' }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', color: 'var(--red)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          RESUME ROAST
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
          Upload your resume. Walter White will cross-reference every claim against your GitHub.
        </p>
      </div>

      {view === 'upload' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: `2px dashed ${file ? 'var(--green-neon)' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '1.5rem'
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
            {file ? (
              <>
                <FileText size={48} style={{ color: 'var(--green-neon)', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--green-neon)', fontSize: '1rem', fontWeight: 600 }}>{file.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Click to change file</p>
              </>
            ) : (
              <>
                <Upload size={48} style={{ color: 'rgba(255,255,255,0.4)', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: '0.5rem' }}>Drag & drop your resume PDF here</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>or click to browse</p>
              </>
            )}
          </div>

          <input
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'var(--white)',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />

          <input
            type="text"
            placeholder="Role Name (optional)"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'var(--white)',
              fontSize: '1rem',
              marginBottom: '1.5rem'
            }}
          />

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--red)', borderRadius: '8px', marginBottom: '1rem' }}>
              <AlertCircle size={18} style={{ color: 'var(--red)' }} />
              <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || !username.trim() || loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: file && username.trim() ? 'var(--red)' : 'rgba(255,255,255,0.1)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: file && username.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              letterSpacing: '0.1em'
            }}
          >
            ROAST MY RESUME
          </button>
        </div>
      )}

      {view === 'loading' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <Loader size={64} style={{ color: 'var(--yellow)', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: i <= loadingStep ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '8px', transition: 'all 0.3s' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i < loadingStep ? 'var(--green-neon)' : i === loadingStep ? 'var(--yellow)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: i <= loadingStep ? 'var(--black)' : 'rgba(255,255,255,0.3)' }}>
                  {i < loadingStep ? '✓' : i + 1}
                </div>
                <span style={{ color: i <= loadingStep ? 'var(--white)' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'results' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <CircularScore score={result.matchScore} label={fraudGrade(result.verdict.fraudScore).label} />
            
            <div style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid var(--orange)', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: 'var(--orange)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                WALTER'S VERDICT
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '1rem', fontStyle: 'italic' }}>
                "{result.verdict.walterQuote}"
              </p>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                {result.verdict.roastText}
              </p>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--yellow)', marginBottom: '0.25rem', letterSpacing: '0.1em' }}>FRAUD ASSESSMENT</div>
                <div style={{ fontSize: '1.5rem', color: fraudGrade(result.verdict.fraudScore).color, fontWeight: 700 }}>
                  {result.verdict.verdict}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: 'var(--yellow)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
              CLAIM VERIFICATION
            </h3>
            <ClaimTable claims={result.claims} />

            <ActionPlan steps={result.verdict.actionPlan} title="WALTER'S ACTION PLAN" />
          </div>
        </div>
      )}
    </div>
  )
}
'''

with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/ResumeRoast.jsx', 'w') as f:
    f.write(content)
print('Fixed ResumeRoast.jsx')
