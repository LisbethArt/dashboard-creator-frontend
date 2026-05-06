import type { DataframeClientDataset } from '../types/api'
import {
  AI_SUGGESTIONS_PATH,
  DASHBOARD_PATH,
  DATA_UPLOAD_PATH,
  SETTINGS_PATH,
} from '../config/nav'

export type AnalysisFlowGuardContext = {
  uploadId: string | null
  datasetProfile: DataframeClientDataset | null
  suggestions: { length: number }
}

/**
 * Step 4 (dashboard preview) is reachable only after a successful upload and AI analysis.
 */
export function canReachAnalysisFlowStepFour(ctx: AnalysisFlowGuardContext): boolean {
  return blockedReasonForAnalysisStep(DASHBOARD_PATH, DATA_UPLOAD_PATH, ctx) === null
}

/**
 * When non-null, navigation to `targetPath` must be blocked (with this reason for UI).
 */
export function blockedReasonForAnalysisStep(
  targetPath: string,
  currentPath: string,
  ctx: AnalysisFlowGuardContext,
): string | null {
  if (targetPath === currentPath) {
    return null
  }
  if (targetPath === DATA_UPLOAD_PATH) {
    return null
  }
  if (targetPath === SETTINGS_PATH) {
    if (!ctx.uploadId) {
      return 'Suba y analice un archivo para abrir la configuración de datos'
    }
    if (!ctx.datasetProfile) {
      return 'No hay perfil de datos disponible; vuelva a cargar el archivo'
    }
    return null
  }
  if (targetPath === AI_SUGGESTIONS_PATH || targetPath === DASHBOARD_PATH) {
    if (!ctx.uploadId) {
      return 'Complete primero la carga de datos'
    }
    if (ctx.suggestions.length === 0) {
      return 'No hay sugerencias hasta completar el análisis'
    }
    return null
  }
  return null
}
