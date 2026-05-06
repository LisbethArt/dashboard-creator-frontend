export const DATA_UPLOAD_PATH = '/upload-data'
export const AI_SUGGESTIONS_PATH = '/ai-suggestions'
export const SETTINGS_PATH = '/settings'
export const EXPORT_REPORT_PATH = '/export-report'
export const DASHBOARD_PATH = '/dashboard'

export type NavKey =
  | 'home'
  | 'data-upload'
  | 'ai-suggestions'
  | 'dashboard'
  | 'settings'
  | 'export-report'

export type NavItem = {
  key: NavKey
  path: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', path: '/', label: 'Inicio', icon: 'home' },
  {
    key: 'data-upload',
    path: DATA_UPLOAD_PATH,
    label: 'Cargar datos',
    icon: 'upload_file',
  },
  {
    key: 'ai-suggestions',
    path: AI_SUGGESTIONS_PATH,
    label: 'Sugerencias IA',
    icon: 'psychology',
  },
  {
    key: 'dashboard',
    path: DASHBOARD_PATH,
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    key: 'settings',
    path: SETTINGS_PATH,
    label: 'Configuración',
    icon: 'settings',
  },
  {
    key: 'export-report',
    path: EXPORT_REPORT_PATH,
    label: 'Exportar reporte',
    icon: 'ios_share',
  },
]
