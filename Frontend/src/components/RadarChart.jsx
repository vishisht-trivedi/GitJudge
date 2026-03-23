import { useEffect, useRef } from 'react'

const LABELS = ['Commit\nPurity', 'Language\nMastery', 'Repo\nQuality', 'Community\nRep', 'Heisenberg\nFactor']

export default function RadarChart({ stats }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !stats) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    const r = Math.min(W, H) * 0.35
    const n = 5
    const values = [stats.commitPurity, stats.languageMastery, stats.repoQuality, stats.communityRep, stats.heisenbergFactor]

    ctx.clearRect(0, 0, W, H)

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
        const x = cx + (r * ring / 4) * Math.cos(angle)
        const y = cy + (r * ring / 4) * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = 'rgba(98,168,84,0.2)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Axes
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
      ctx.strokeStyle = 'rgba(98,168,84,0.3)'
      ctx.stroke()
    }

    // Data polygon
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      const val = (values[i] || 0) / 100
      const x = cx + r * val * Math.cos(angle)
      const y = cy + r * val * Math.sin(angle)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(98,168,84,0.25)'
    ctx.fill()
    ctx.strokeStyle = '#62A854'
    ctx.lineWidth = 2
    ctx.stroke()

    // Dots
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      const val = (values[i] || 0) / 100
      const x = cx + r * val * Math.cos(angle)
      const y = cy + r * val * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#8BC34A'
      ctx.fill()
    }

    // Labels
    ctx.font = '10px Share Tech Mono, monospace'
    ctx.fillStyle = '#6B6B58'
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      const lx = cx + (r + 28) * Math.cos(angle)
      const ly = cy + (r + 28) * Math.sin(angle)
      const lines = LABELS[i].split('\n')
      lines.forEach((line, li) => ctx.fillText(line, lx, ly + li * 12 - (lines.length - 1) * 6))
    }
  }, [stats])

  return <canvas ref={canvasRef} width={280} height={280} style={{ display: 'block', margin: '0 auto' }} />
}
