export type ChartType = 'bar' | 'line' | 'pie' | 'scatter'

export type ChartSuggestion = {
  title: string
  chart_type: ChartType
  parameters: Record<string, string>
  insight: string
}

export type AnalyzeResponse = {
  upload_id: string
  suggestions: ChartSuggestion[]
}

export type ChartSeriesRequest = {
  upload_id: string
  chart_type: ChartType
  parameters: Record<string, string>
}

export type ChartSeriesResponse = {
  chart_type: ChartType
  data: Array<Record<string, string | number>>
}

export type DashboardWidget = {
  id: string
  suggestion: ChartSuggestion
}
