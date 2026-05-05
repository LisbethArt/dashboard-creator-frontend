import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { AiSuggestionsPage } from './pages/AiSuggestionsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DataSettingsPage } from './pages/DataSettingsPage'
import { DataUploadPage } from './pages/DataUploadPage'
import { ExportReportPage } from './pages/ExportReportPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AppShell />}>
        <Route path="/cargar-datos" element={<DataUploadPage />} />
        <Route path="/sugerencias" element={<AiSuggestionsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/configuracion" element={<DataSettingsPage />} />
        <Route path="/exportar" element={<ExportReportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
