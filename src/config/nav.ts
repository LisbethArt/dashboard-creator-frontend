export const DATA_UPLOAD_PATH = '/upload-data'
export const AI_SUGGESTIONS_PATH = '/ai-suggestions'
export const SETTINGS_PATH = '/settings'
export const EXPORT_REPORT_PATH = '/export-report'
export const DASHBOARD_PATH = '/dashboard'
export const PUBLISHED_DASHBOARD_PATH = '/dashboard-board'

export const ANALYSIS_FLOW_STEPS = [
  {
    path: DATA_UPLOAD_PATH,
    label: 'Cargar datos',
    shortLabel: 'Cargar',
    icon: 'upload_file',
  },
  {
    path: SETTINGS_PATH,
    label: 'Configuración de datos',
    shortLabel: 'Datos',
    icon: 'table_chart',
  },
  {
    path: AI_SUGGESTIONS_PATH,
    label: 'Sugerencias IA',
    shortLabel: 'IA',
    icon: 'psychology',
  },
  {
    path: DASHBOARD_PATH,
    label: 'Previsualización del dashboard',
    shortLabel: 'Vista previa',
    icon: 'dashboard',
  },
] as const

export const ANALYSIS_FLOW_PATHS = ANALYSIS_FLOW_STEPS.map((s) => s.path) as readonly string[]

export function isAnalysisFlowPath(pathname: string): boolean {
  return ANALYSIS_FLOW_PATHS.includes(pathname)
}

/** Flow steps 1–3 (upload, settings, AI); excludes dashboard preview so sidebar highlights one section at a time. */
export function isAnalysisWorkflowHubPath(pathname: string): boolean {
  return isAnalysisFlowPath(pathname) && pathname !== DASHBOARD_PATH
}

export type NavKey = 'home' | 'analysis-workflow' | 'dashboard' | 'export-report'

export type NavItem = {
  key: NavKey
  path: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', path: '/', label: 'Inicio', icon: 'home' },
  {
    key: 'analysis-workflow',
    path: DATA_UPLOAD_PATH,
    label: 'Datos e IA',
    icon: 'hub',
  },
  {
    key: 'dashboard',
    path: PUBLISHED_DASHBOARD_PATH,
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    key: 'export-report',
    path: EXPORT_REPORT_PATH,
    label: 'Exportar reporte',
    icon: 'ios_share',
  },
]
