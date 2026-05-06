import type { ChartType, DashboardWidget, DashboardWidgetLayout } from '../types/api'

const SIZE_BY_CHART: Record<ChartType, Pick<DashboardWidgetLayout, 'w' | 'h' | 'minW' | 'minH'>> = {
  bar: { w: 6, h: 5, minW: 4, minH: 4 },
  line: { w: 6, h: 5, minW: 4, minH: 4 },
  pie: { w: 5, h: 5, minW: 3, minH: 4 },
  scatter: { w: 6, h: 5, minW: 4, minH: 4 },
}

/**
 * Provides default grid dimensions per chart type so minimum readable chart area is preserved.
 */
export function defaultLayoutForChartType(
  chartType: ChartType,
  existing: Pick<DashboardWidget, 'layout'>[],
): DashboardWidgetLayout {
  const base = SIZE_BY_CHART[chartType]
  const maxY =
    existing.length === 0 ? 0 : Math.max(...existing.map((w) => w.layout.y + w.layout.h))
  return {
    x: 0,
    y: maxY,
    w: base.w,
    h: base.h,
    minW: base.minW,
    minH: base.minH,
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
