export default function ActionPlan({ steps = [] }) {
  if (!steps.length) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
          <div style={{
            minWidth: 24, height: 24,
            background: 'rgba(98,168,84,0.15)',
            border: '1px solid rgba(98,168,84,0.4)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-title)', fontSize: '0.65rem',
            color: 'var(--green-neon)', flexShrink: 0
          }}>
            {i + 1}
          </div>
          <div>
            {step.title && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--green-bright)', marginBottom: '0.15rem' }}>
                {step.title}
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-worn)', fontSize: '0.8rem', color: 'var(--white)', lineHeight: 1.55 }}>
              {step.detail || step}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
