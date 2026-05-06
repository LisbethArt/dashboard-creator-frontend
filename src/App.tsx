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
import { AiSuggestionsPage } from './pages/AiSuggestionsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DataSettingsPage } from './pages/DataSettingsPage'
import { DataUploadPage } from './pages/DataUploadPage'
import { ExportReportPage } from './pages/ExportReportPage'
import { HomePage } from './pages/HomePage'
import { PublishedDashboardPage } from './pages/PublishedDashboardPage'

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
        <Route path={AI_SUGGESTIONS_PATH} element={<AiSuggestionsPage />} />
        <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
        <Route path={PUBLISHED_DASHBOARD_PATH} element={<PublishedDashboardPage />} />
        <Route path={SETTINGS_PATH} element={<DataSettingsPage />} />
        <Route path={EXPORT_REPORT_PATH} element={<ExportReportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
