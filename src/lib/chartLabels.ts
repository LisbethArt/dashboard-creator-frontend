import type { ChartType } from '../types/api'

export function chartTypeLabelEs(chartType: ChartType): string {
  switch (chartType) {
    case 'bar':
      return 'Barras'
    case 'line':
      return 'Líneas'
    case 'pie':
      return 'Pastel'
    case 'scatter':
      return 'Dispersión'
    default:
      return chartType
  }
}
