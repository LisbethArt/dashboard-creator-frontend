import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeSpreadsheetWithProgress } from '../api/analysis'
import { AI_SUGGESTIONS_PATH } from '../config/nav'
import type { ChartSuggestion, DashboardWidget } from '../types/api'

type AnalysisFlowContextValue = {
  uploadId: string | null
  suggestions: ChartSuggestion[]
  dashboardWidgets: DashboardWidget[]
  isAnalyzing: boolean
  analysisProgress: number
  activeFileLabel: string | null
  lastError: string | null
  runAnalysis: (file: File) => Promise<void>
  clearError: () => void
  addWidget: (suggestion: ChartSuggestion) => void
  removeWidget: (widgetId: string) => void
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
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [activeFileLabel, setActiveFileLabel] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const clearError = useCallback(() => setLastError(null), [])

  const resetSession = useCallback(() => {
    setUploadId(null)
    setSuggestions([])
    setDashboardWidgets([])
    setActiveFileLabel(null)
    setAnalysisProgress(0)
    setLastError(null)
  }, [])

  const runAnalysis = useCallback(
    async (file: File) => {
      setIsAnalyzing(true)
      setAnalysisProgress(0)
      setLastError(null)
      setActiveFileLabel(file.name)
      setDashboardWidgets([])
      try {
        const response = await analyzeSpreadsheetWithProgress(file, setAnalysisProgress)
        setUploadId(response.upload_id)
        setSuggestions(response.suggestions)
        navigate(AI_SUGGESTIONS_PATH)
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
    setDashboardWidgets((prev) => [
      ...prev,
      { id: crypto.randomUUID(), suggestion: { ...suggestion } },
    ])
  }, [])

  const removeWidget = useCallback((widgetId: string) => {
    setDashboardWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }, [])

  const value = useMemo(
    () => ({
      uploadId,
      suggestions,
      dashboardWidgets,
      isAnalyzing,
      analysisProgress,
      activeFileLabel,
      lastError,
      runAnalysis,
      clearError,
      addWidget,
      removeWidget,
      resetSession,
    }),
    [
      uploadId,
      suggestions,
      dashboardWidgets,
      isAnalyzing,
      analysisProgress,
      activeFileLabel,
      lastError,
      runAnalysis,
      clearError,
      addWidget,
      removeWidget,
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
