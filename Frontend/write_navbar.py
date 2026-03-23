content = """import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FlaskConical, Swords, Trophy, Volume2, VolumeX, Briefcase, FileText } from 'lucide-react'
import { setSoundEnabled, soundClick } from '../utils/sounds'

const QUOTES = [
  'Walter: "Say my name."',
  'Walter: "I am the one who knocks."',
  'Mike: "No more half measures."',
  'Saul: "Better call Saul!"',
  'Gus: "I hide in plain sight, same as you."',
  'Walter: "Chemistry is the study of change."',
  'Jesse: "Yeah, science!"',
  'Walter: "I did it for me. I liked it. I was good at it."',
  'Walter: "Tread lightly."',
  'Heisenberg: "Say my name."',
  'Walter: "I am the danger."',
]

export default function Navbar() {
  const loc = useLocation()
  const [sound, setSound] = useState(true)

  const isActive = (path) => loc.pathname === path

  const toggleSound = () => {
    const next = !sound
    setSound(next)
    setSoundEnabled(next)
  }

  const NAV_LINKS = [
    { to: '/',             Icon: FlaskConical, label: 'ANALYZE',      color: 'var(--green-bright)' },
    { to: '/battle',       Icon: Swords,       label: 'BATTLE',       color: 'var(--orange)' },
    { to: '/leaderboard',  Icon: Trophy,       label: 'LEADERBOARD',  color: 'var(--yellow)' },
    { to: '/job-fit',      Icon: Briefcase,    label: 'JOB FIT',      color: 'var(--green-neon)' },
    { to: '/resume-roast', Icon: FileText,     label: 'RESUME ROAST', color: 'var(--red)' },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }} onClick={soundClick}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[['35','Br','Bromine'],['56','Ba','Barium'],['79','Au','Gold']].map(([num,sym,name]) => (
                <div key={sym} className="element-box" style={{ minWidth: '40px', padding: '0.2rem 0.35rem' }}>
                  <div className="atomic-num">{num}</div>
                  <div className="symbol" style={{ fontSize: '0.9rem' }}>{sym}</div>
                  <div className="name">{name}</div>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--green-neon)', letterSpacing: '0.12em' }}>
              GIT<span style={{ color: 'var(--yellow)' }}>JUDGE</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', fontFamily: 'var(--font-title)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              {NAV_LINKS.map(({ to, Icon, label, color }) => (
                <Link key={to} to={to} onClick={soundClick}
                  style={{
                    color: isActive(to) ? color : 'var(--white)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    borderBottom: isActive(to) ? `2px solid ${color}` : '2px solid transparent',
                    paddingBottom: '2px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = color}
                  onMouseLeave={e => e.currentTarget.style.color = isActive(to) ? color : 'var(--white)'}
                >
                  <Icon size={13} style={{ color }} />
                  {label}
                </Link>
              ))}
            </div>
            <button className="sound-btn" onClick={toggleSound} title={sound ? 'Mute' : 'Unmute'}>
              {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Ticker */}
      <div className="bb-ticker">
        <div className="bb-ticker-inner">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <span key={i}>{q} &nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>
    </>
  )
}
"""

with open('/home/visi/linux_entry/GitJudge/Frontend/src/components/Navbar.jsx', 'w') as f:
    f.write(content)
print('Navbar.jsx written')
