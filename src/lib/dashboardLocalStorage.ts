import type { DashboardWidget } from '../types/api'

const LS_KEY = (uploadId: string) => `dashboard-creator:dashboard-widgets:${uploadId}`

export function persistDashboardWidgets(uploadId: string, widgets: DashboardWidget[]) {
  try {
    localStorage.setItem(LS_KEY(uploadId), JSON.stringify(widgets))
  } catch {
    /* quota or private mode */
  }
}

export function clearPersistedDashboard(uploadId: string) {
  try {
    localStorage.removeItem(LS_KEY(uploadId))
  } catch {
    /* ignore */
  }
}
