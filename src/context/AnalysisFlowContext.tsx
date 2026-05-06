import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeSpreadsheetWithProgress } from '../api/analysis'
import { SETTINGS_PATH } from '../config/nav'
import { clearPersistedDashboard, persistDashboardWidgets } from '../lib/dashboardLocalStorage'
import {
  defaultLayoutForChartType,
  patchLayoutsFromGridSave,
} from '../lib/dashboardWidgetLayout'
import { chartSuggestionsEqual } from '../lib/chartSuggestionIdentity'
import type {
  ChartSuggestion,
  DashboardWidget,
  DataframeClientDataset,
} from '../types/api'

type AnalysisFlowContextValue = {
  uploadId: string | null
  suggestions: ChartSuggestion[]
  datasetProfile: DataframeClientDataset | null
  dashboardWidgets: DashboardWidget[]
  isAnalyzing: boolean
  analysisProgress: number
  activeFileLabel: string | null
  lastError: string | null
  runAnalysis: (file: File) => Promise<void>
  clearError: () => void
  addWidget: (suggestion: ChartSuggestion) => void
  removeWidget: (widgetId: string) => void
  applyDashboardLayoutFromGrid: (
    patches: Array<{ id: string; x: number; y: number; w: number; h: number }>,
  ) => void
  suggestionIsOnDashboard: (suggestion: ChartSuggestion) => boolean
  resetSession: () => void
}

const AnalysisFlowContext = createContext<AnalysisFlowContextValue | null>(null)

/**
 * Coordinates upload results, AI suggestions, and dashboard widgets across portal routes.
 */
export function AnalysisFlowProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<ChartSuggestion[]>([])
  const [datasetProfile, setDatasetProfile] = useState<DataframeClientDataset | null>(null)
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [activeFileLabel, setActiveFileLabel] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const clearError = useCallback(() => setLastError(null), [])

  const resetSession = useCallback(() => {
    setUploadId((prevUpload) => {
      if (prevUpload) {
        clearPersistedDashboard(prevUpload)
      }
      return null
    })
    setSuggestions([])
    setDatasetProfile(null)
    setDashboardWidgets([])
    setActiveFileLabel(null)
    setAnalysisProgress(0)
    setLastError(null)
  }, [])

  const runAnalysis = useCallback(
    async (file: File) => {
      if (file.size === 0) {
        setLastError('El archivo está vacío.')
        return
      }
      const max = 50 * 1024 * 1024
      if (file.size > max) {
        setLastError(`El archivo supera el tamaño máximo permitido (${max / (1024 * 1024)} MB).`)
        return
      }
      const lower = file.name.toLowerCase()
      if (!lower.endsWith('.csv') && !lower.endsWith('.xlsx')) {
        setLastError('Solo se admiten archivos .csv o .xlsx.')
        return
      }
      setIsAnalyzing(true)
      setAnalysisProgress(0)
      setLastError(null)
      setActiveFileLabel(file.name)
      setDashboardWidgets([])
      try {
        const response = await analyzeSpreadsheetWithProgress(file, setAnalysisProgress)
        setUploadId(response.upload_id)
        setSuggestions(response.suggestions)
        setDatasetProfile(response.dataset)
        navigate(SETTINGS_PATH)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudo completar el análisis con la IA.'
        setLastError(message)
      } finally {
        setIsAnalyzing(false)
        setAnalysisProgress(0)
      }
    },
    [navigate],
  )

  const addWidget = useCallback((suggestion: ChartSuggestion) => {
    setDashboardWidgets((prev) => {
      if (prev.some((w) => chartSuggestionsEqual(w.suggestion, suggestion))) {
        return prev
      }
      const layout = defaultLayoutForChartType(suggestion, prev)
      return [...prev, { id: crypto.randomUUID(), suggestion: { ...suggestion }, layout }]
    })
  }, [])

  const applyDashboardLayoutFromGrid = useCallback(
    (patches: Array<{ id: string; x: number; y: number; w: number; h: number }>) => {
      setDashboardWidgets((prev) => patchLayoutsFromGridSave(prev, patches))
    },
    [],
  )

  const suggestionIsOnDashboard = useCallback(
    (suggestion: ChartSuggestion) =>
      dashboardWidgets.some((w) => chartSuggestionsEqual(w.suggestion, suggestion)),
    [dashboardWidgets],
  )

  const removeWidget = useCallback((widgetId: string) => {
    setDashboardWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }, [])

  useEffect(() => {
    if (!uploadId || dashboardWidgets.length === 0) {
      return
    }
    persistDashboardWidgets(uploadId, dashboardWidgets)
  }, [uploadId, dashboardWidgets])

  const value = useMemo(
    () => ({
      uploadId,
      suggestions,
      datasetProfile,
      dashboardWidgets,
      isAnalyzing,
      analysisProgress,
      activeFileLabel,
      lastError,
      runAnalysis,
      clearError,
      addWidget,
      removeWidget,
      applyDashboardLayoutFromGrid,
      suggestionIsOnDashboard,
      resetSession,
    }),
    [
      uploadId,
      suggestions,
      datasetProfile,
      dashboardWidgets,
      isAnalyzing,
      analysisProgress,
      activeFileLabel,
      lastError,
      runAnalysis,
      clearError,
      addWidget,
      removeWidget,
      applyDashboardLayoutFromGrid,
      suggestionIsOnDashboard,
      resetSession,
    ],
  )

  return <AnalysisFlowContext.Provider value={value}>{children}</AnalysisFlowContext.Provider>
}

export function useAnalysisFlow(): AnalysisFlowContextValue {
  const ctx = useContext(AnalysisFlowContext)
  if (!ctx) {
    throw new Error('useAnalysisFlow must be used within AnalysisFlowProvider')
  }
  return ctx
}
