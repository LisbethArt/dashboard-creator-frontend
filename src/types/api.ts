export type ChartType = 'bar' | 'line' | 'pie' | 'scatter'

export type ChartSuggestion = {
  title: string
  chart_type: ChartType
  parameters: Record<string, string>
  insight: string
}

export type DatasetColumn = {
  name: string
  pandas_dtype: string
  kind: 'datetime' | 'numeric' | 'text'
  select_options: string[]
  default_select: string
}

export type DatasetTypeDistribution = {
  strings: number
  numerics: number
  datetimes: number
}

export type DataframeClientDataset = {
  row_count: number
  column_count: number
  sample_tag: string
  columns: DatasetColumn[]
  preview_rows: Array<Record<string, string>>
  null_cells: number
  duplicate_rows: number
  memory_mb: number
  numeric_skew: number | null
  integrity_percent: number
  ai_hint: string
  type_distribution: DatasetTypeDistribution
}

export type AnalyzeResponse = {
  upload_id: string
  suggestions: ChartSuggestion[]
  dataset: DataframeClientDataset
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

export type DashboardWidgetLayout = {
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

export type DashboardWidget = {
  id: string
  suggestion: ChartSuggestion
  layout: DashboardWidgetLayout
}
