import { useEffect, useRef } from 'react'

const CHEMICALS = [
  'CH₃', 'C₆H₆', 'NaOH', 'HCl', 'H₂SO₄', 'NH₃', 'CO₂', 'N₂O',
  'C₁₀H₁₅N', 'Ba', 'Br', 'Au', 'Hg', 'Po', 'Ag', 'K',
  'CH₄', 'C₂H₅OH', 'HNO₃', 'KMnO₄', 'NaCl', 'H₂O₂',
  'Methylamine', 'Phenylacetone', 'Pseudoephedrine',
  'Blue Sky', 'Heisenberg', 'CH₃NH₂', 'P₂P',
]

export default function SmokyBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let animId

    // Smoke particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      life: Math.random(),
      maxLife: Math.random() * 0.5 + 0.5,
      color: Math.random() > 0.7 ? '#F5C518' : '#62A854',
    }))

    // Floating chemical labels
  const labels = Array.from({ length: 30 }, () => ({
      text: CHEMICALS[Math.floor(Math.random() * CHEMICALS.length)],
      x: Math.random() * W,
      y: Math.random() * H,
      vy: -(Math.random() * 0.10 + 0.02),
      vx: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.22 + 0.12,
      size: Math.random() * 7 + 8,
      life: Math.random(),
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Draw smoke particles
      particles.forEach(p => {
        p.life += 0.003
        if (p.life > p.maxLife) {
          p.x = Math.random() * W
          p.y = H + 10
          p.life = 0
          p.maxLife = Math.random() * 0.5 + 0.5
          p.alpha = Math.random() * 0.4 + 0.1
        }
        p.x += p.vx + Math.sin(p.life * 3) * 0.2
        p.y += p.vy
        const fade = p.life < 0.1
          ? p.life / 0.1
          : p.life > p.maxLife * 0.8
            ? (p.maxLife - p.life) / (p.maxLife * 0.2)
            : 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * fade * 0.55
        ctx.fill()
      })

      // Draw floating chemical labels
      labels.forEach(l => {
        l.y += l.vy
        l.x += l.vx
        l.life += 0.0015

        // Reset when drifted off screen
        if (l.y < -30) {
          l.y = H + 20
          l.x = Math.random() * W
          l.life = 0
          l.text = CHEMICALS[Math.floor(Math.random() * CHEMICALS.length)]
        }
        if (l.x < -80 || l.x > W + 80) {
          l.x = Math.random() * W
        }

        const fade = l.life < 0.15
          ? l.life / 0.15
          : l.life > 0.85
            ? (1 - l.life) / 0.15
            : 1

        ctx.globalAlpha = l.alpha * fade
        ctx.font = `${l.size}px 'Share Tech Mono', monospace`
        ctx.fillStyle = Math.random() > 0.97 ? '#F5C518' : '#62A854'
        ctx.fillText(l.text, l.x, l.y)
      })

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
