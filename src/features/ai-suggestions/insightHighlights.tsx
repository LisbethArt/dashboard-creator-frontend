import type { ReactNode } from 'react'
import styles from './AiSuggestionsScreen.module.css'

/** Percentages and decimal numbers (common in analytic copy). */
const METRIC_PATTERN = /\d+(?:[.,]\d+)?\s*%|\d+(?:[.,]\d+)/g

/**
 * Highlights numeric fragments in insight text for glanceable KPI-style cards.
 */
export function formatInsightHighlights(body: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  METRIC_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null
  let idx = 0
  while ((match = METRIC_PATTERN.exec(body)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`t-${idx++}`}>{body.slice(lastIndex, match.index)}</span>)
    }
    nodes.push(
      <strong key={`m-${idx++}`} className={styles.insightStrong}>
        {match[0].trim()}
      </strong>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < body.length) {
    nodes.push(<span key={`t-${idx++}`}>{body.slice(lastIndex)}</span>)
  }
  return nodes.length > 0 ? nodes : [<span key="o">{body}</span>]
}
