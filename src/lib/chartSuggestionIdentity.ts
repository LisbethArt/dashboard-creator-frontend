import type { ChartSuggestion } from '../types/api'

/**
 * Deep-enough equality for matching a suggestion card to an existing dashboard widget
 * (same chart intent and column bindings).
 */
export function chartSuggestionsEqual(a: ChartSuggestion, b: ChartSuggestion): boolean {
  if (a.title !== b.title || a.chart_type !== b.chart_type || a.insight !== b.insight) {
    return false
  }
  const keysA = Object.keys(a.parameters).sort()
  const keysB = Object.keys(b.parameters).sort()
  if (keysA.length !== keysB.length) {
    return false
  }
  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) {
      return false
    }
  }
  for (const k of keysA) {
    if (a.parameters[k] !== b.parameters[k]) {
      return false
    }
  }
  return true
}
