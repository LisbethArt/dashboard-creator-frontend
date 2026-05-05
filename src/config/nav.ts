export type NavKey =
  | 'home'
  | 'cargar-datos'
  | 'sugerencias'
  | 'dashboard'
  | 'configuracion'
  | 'exportar'

export type NavItem = {
  key: NavKey
  path: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', path: '/', label: 'Inicio', icon: 'home' },
  {
    key: 'cargar-datos',
    path: '/cargar-datos',
    label: 'Cargar datos',
    icon: 'upload_file',
  },
  {
    key: 'sugerencias',
    path: '/sugerencias',
    label: 'Sugerencias IA',
    icon: 'psychology',
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    key: 'configuracion',
    path: '/configuracion',
    label: 'Configuración',
    icon: 'settings',
  },
  {
    key: 'exportar',
    path: '/exportar',
    label: 'Exportar reporte',
    icon: 'ios_share',
  },
]
