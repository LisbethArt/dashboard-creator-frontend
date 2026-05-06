import type { ChartSuggestion, ChartType, DashboardWidget, DashboardWidgetLayout } from '../types/api'

const SIZE_BY_CHART: Record<ChartType, Pick<DashboardWidgetLayout, 'w' | 'h' | 'minW' | 'minH'>> = {
  bar: { w: 6, h: 5, minW: 4, minH: 4 },
  line: { w: 6, h: 5, minW: 4, minH: 4 },
  pie: { w: 5, h: 5, minW: 3, minH: 4 },
  scatter: { w: 6, h: 5, minW: 4, minH: 4 },
}

/**
 * Rows (grid units ~72px tall) inferred from headline copy so previews keep text readable.
 */
function contentAwareMinExtents(
  chartType: ChartType,
  suggestion: ChartSuggestion,
): Pick<DashboardWidgetLayout, 'minW' | 'minH'> {
  const base = SIZE_BY_CHART[chartType]
  const titleLen = suggestion.title.trim().length
  const insightLen = suggestion.insight.trim().length
  const legendExtra = chartType === 'pie' || chartType === 'line' ? 1 : 0
  const densePointsExtra = chartType === 'scatter' ? 1 : 0

  const minW = Math.min(
    12,
    Math.max(base.minW, base.minW + Math.floor(titleLen / 28)),
  )
  const textRows =
    Math.min(3, Math.floor(titleLen / 42)) + Math.min(3, Math.floor(insightLen / 90))
  const minH = Math.min(
    16,
    Math.max(base.minH, base.minH + textRows + legendExtra + densePointsExtra),
  )

  return { minW, minH }
}

/**
 * Provides default grid dimensions per chart type so minimum readable chart area is preserved.
 */
export function defaultLayoutForChartType(
  suggestion: ChartSuggestion,
  existing: Pick<DashboardWidget, 'layout'>[],
): DashboardWidgetLayout {
  const chartType = suggestion.chart_type
  const base = SIZE_BY_CHART[chartType]
  const { minW, minH } = contentAwareMinExtents(chartType, suggestion)
  const maxY =
    existing.length === 0 ? 0 : Math.max(...existing.map((w) => w.layout.y + w.layout.h))
  return {
    x: 0,
    y: maxY,
    w: base.w,
    h: Math.max(base.h, minH),
    minW,
    minH,
  }
}

export function patchLayoutsFromGridSave(
  widgets: DashboardWidget[],
  patches: Array<{ id: string; x: number; y: number; w: number; h: number }>,
): DashboardWidget[] {
  return widgets.map((w) => {
    const p = patches.find((item) => item.id === w.id)
    if (!p) {
      return w
    }
    return {
      ...w,
      layout: { ...w.layout, x: p.x, y: p.y, w: p.w, h: p.h },
    }
  })
}
