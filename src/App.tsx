import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  AI_SUGGESTIONS_PATH,
  DASHBOARD_PATH,
  DATA_UPLOAD_PATH,
  EXPORT_REPORT_PATH,
  PUBLISHED_DASHBOARD_PATH,
  SETTINGS_PATH,
} from './config/nav'
import { PortalLayout } from './layouts/portal/PortalLayout'
import { useAnalysisFlow } from './context/AnalysisFlowContext'
import { canReachAnalysisFlowStepFour } from './lib/analysisFlowStepGuards'
import { AiSuggestionsPage } from './pages/AiSuggestionsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DataSettingsPage } from './pages/DataSettingsPage'
import { DataUploadPage } from './pages/DataUploadPage'
import { ExportReportPage } from './pages/ExportReportPage'
import { HomePage } from './pages/HomePage'
import { PublishedDashboardPage } from './pages/PublishedDashboardPage'

type RequireStepFourProps = {
  children: ReactElement
}

/**
 * Protects routes that require reaching step 4 in the data-analysis workflow.
 */
function RequireStepFour({ children }: RequireStepFourProps) {
  const { uploadId, datasetProfile, suggestions } = useAnalysisFlow()
  const hasReachedStepFour = canReachAnalysisFlowStepFour({ uploadId, datasetProfile, suggestions })
  if (!hasReachedStepFour) {
    return <Navigate to={DATA_UPLOAD_PATH} replace />
  }
  return children
}

/**
 * Top-level routing: landing is public; workspace routes share {@link PortalLayout}.
 * Spanish path segments redirect to the canonical English paths for existing bookmarks.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cargar-datos" element={<Navigate to={DATA_UPLOAD_PATH} replace />} />
      <Route path="/sugerencias" element={<Navigate to={AI_SUGGESTIONS_PATH} replace />} />
      <Route path="/configuracion" element={<Navigate to={SETTINGS_PATH} replace />} />
      <Route path="/exportar" element={<Navigate to={EXPORT_REPORT_PATH} replace />} />
      <Route element={<PortalLayout />}>
        <Route path={DATA_UPLOAD_PATH} element={<DataUploadPage />} />
        <Route
          path={AI_SUGGESTIONS_PATH}
          element={
            <RequireStepFour>
              <AiSuggestionsPage />
            </RequireStepFour>
          }
        />
        <Route
          path={DASHBOARD_PATH}
          element={
            <RequireStepFour>
              <DashboardPage />
            </RequireStepFour>
          }
        />
        <Route path={PUBLISHED_DASHBOARD_PATH} element={<PublishedDashboardPage />} />
        <Route
          path={SETTINGS_PATH}
          element={
            <RequireStepFour>
              <DataSettingsPage />
            </RequireStepFour>
          }
        />
        <Route
          path={EXPORT_REPORT_PATH}
          element={
            <RequireStepFour>
              <ExportReportPage />
            </RequireStepFour>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
