import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'

export default function SkillsTable({ skills = [] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!skills.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {skills.map((skill, i) => {
        const pct = skill.score ?? 0
        const Icon = pct >= 70 ? CheckCircle : pct >= 40 ? MinusCircle : XCircle
        const color = pct >= 70 ? 'var(--green-bright)' : pct >= 40 ? 'var(--yellow)' : 'var(--orange)'
        return (
          <div key={skill.name || i} style={{ animation: `fadeUp 0.35s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={12} color={color} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--white)' }}>
                  {skill.name}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color }}>{pct}%</span>
            </div>
            <div className="skill-bar">
              <div className="skill-bar-fill" style={{ width: visible ? `${pct}%` : '0%' }} />
            </div>
            {skill.evidence && (
              <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.65rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '2px' }}>
                {skill.evidence}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
