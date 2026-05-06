import type { ChartType } from '../../types/api'
import styles from './ChartTypeArtwork.module.css'

type ChartTypeArtworkProps = {
  kind: ChartType
  title: string
  className?: string
}

/**
 * Decorative SVG vignette for AI suggestion cards; matches chart family without live data.
 */
export function ChartTypeArtwork({ kind, title, className }: ChartTypeArtworkProps) {
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} aria-hidden>
      <svg className={styles.svg} viewBox="0 0 200 160" preserveAspectRatio="xMidYMid meet">
        <title>{title}</title>
        {kind === 'bar' ? <BarMarks /> : null}
        {kind === 'line' ? <LineMarks /> : null}
        {kind === 'pie' ? <PieMarks /> : null}
        {kind === 'scatter' ? <ScatterMarks /> : null}
      </svg>
    </div>
  )
}

function BarMarks() {
  const bars = [0.42, 0.72, 0.55, 0.88, 0.5, 0.68].map((h, i) => {
    const w = 22
    const gap = 8
    const x = 20 + i * (w + gap)
    const yMax = 120
    const bh = yMax * h
    return (
      <rect
        key={i}
        x={x}
        y={132 - bh}
        width={w}
        height={bh}
        rx={5}
        className={styles.bar}
      />
    )
  })
  return (
    <g>
      <line x1="12" y1="132" x2="188" y2="132" className={styles.axis} />
      {bars}
    </g>
  )
}

function LineMarks() {
  return (
    <g>
      <path
        d="M 20 118 L 48 92 L 76 100 L 104 72 L 132 54 L 160 62 L 180 44"
        className={styles.lineStroke}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 20 118 L 48 92 L 76 100 L 104 72 L 132 54 L 160 62 L 180 44 V 134 H 20 Z"
        className={styles.area}
      />
      <circle cx="48" cy="92" r="4" className={styles.dot} />
      <circle cx="132" cy="54" r="4" className={styles.dot} />
      <circle cx="180" cy="44" r="4" className={styles.dot} />
      <line x1="14" y1="134" x2="188" y2="134" className={styles.axis} />
    </g>
  )
}

function PieMarks() {
  return (
    <g transform="translate(100 80)">
      <path d="M 0 0 L 0 -42 A 42 42 0 1 1 -30 30 Z" className={styles.sliceA} />
      <path d="M 0 0 L -30 30 A 42 42 0 0 1 -26 -36 Z" className={styles.sliceB} />
      <path d="M 0 0 L -26 -36 A 42 42 0 0 1 42 0 Z" className={styles.sliceC} />
      <circle r="22" className={styles.donutHole} cx="0" cy="0" />
    </g>
  )
}

function ScatterMarks() {
  const pts: [number, number][] = [
    [36, 108],
    [52, 78],
    [68, 96],
    [88, 52],
    [102, 72],
    [118, 44],
    [142, 58],
    [162, 38],
    [172, 66],
    [94, 88],
    [128, 92],
  ]
  return (
    <g>
      <line x1="24" y1="128" x2="184" y2="128" className={styles.axis} />
      <line x1="24" y1="132" x2="24" y2="36" className={styles.axis} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" className={styles.scatterPt} />
      ))}
    </g>
  )
}
