import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function ClaimTable({ claims }) {
  const statusConfig = {
    verified: { icon: CheckCircle, color: 'var(--green-neon)', label: 'VERIFIED' },
    partial: { icon: AlertCircle, color: 'var(--yellow)', label: 'PARTIAL' },
    unverified: { icon: XCircle, color: 'var(--red)', label: 'NO EVIDENCE' }
  }

  return (
    <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.1em' }}>CLAIM</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.1em' }}>SKILL</th>
            <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.1em' }}>STATUS</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--yellow)', letterSpacing: '0.1em' }}>EVIDENCE</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c, i) => {
            const cfg = statusConfig[c.status] || statusConfig.unverified
            const Icon = cfg.icon
            return (
              <tr key={i} style={{ borderBottom: i < claims.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--white)' }}>{c.claim}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--green-bright)' }}>{c.skill}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: `${cfg.color}22`, border: `1px solid ${cfg.color}`, fontSize: '0.7rem', color: cfg.color, fontWeight: 600 }}>
                    <Icon size={12} />
                    {cfg.label}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{c.evidence}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
