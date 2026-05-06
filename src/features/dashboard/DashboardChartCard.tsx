import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MaterialIcon } from '../../components/MaterialIcon'
import { fetchChartSeries } from '../../api/analysis'
import { chartTypeLabelEs } from '../../lib/chartLabels'
import type { ChartSuggestion, ChartType } from '../../types/api'
import styles from './DashboardChartCard.module.css'

const PIE_PALETTE = ['#1fbecc', '#13708a', '#5fd4e0', '#10b981', '#64748b', '#0d5666']
const CHART_CACHE_PREFIX = 'dashboard-creator:chart-series:'
const MAX_FETCH_RETRIES = 2

function seriesCacheKey(
  uploadId: string,
  chartType: ChartType,
  parametersKey: string,
): string {
  return `${CHART_CACHE_PREFIX}${uploadId}:${chartType}:${parametersKey}`
}

function loadCachedSeries(cacheKey: string): Array<Record<string, string | number>> | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem(cacheKey)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return null
    }
    return parsed as Array<Record<string, string | number>>
  } catch {
    return null
  }
}

function saveCachedSeries(cacheKey: string, rows: Array<Record<string, string | number>>) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(rows))
  } catch {
    return
  }
}

function barChartBottomMargin(barCount: number): number {
  return Math.min(104, Math.max(10, 10 + Math.min(barCount, 24) * (barCount > 14 ? 6 : 4)))
}

type DashboardChartCardProps = {
  widgetId: string
  uploadId: string
  suggestion: ChartSuggestion
  onRemove: () => void
  showRemove?: boolean
  fillContainer?: boolean
}

function renderChart(
  kind: ChartType,
  rows: Array<Record<string, string | number>>,
  fillContainer: boolean,
  chartMinPx?: number,
) {
  const n = rows.length
  const marginBottomBar = barChartBottomMargin(n)

  if (kind === 'bar') {
    const denseCats = n > 12
    return (
      <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
        <BarChart
          data={rows}
          margin={{ top: 8, right: 12, bottom: marginBottomBar, left: denseCats ? 12 : 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }}
            angle={denseCats ? -22 : 0}
            textAnchor={denseCats ? 'end' : 'middle'}
            height={denseCats ? 72 : undefined}
            interval={0}
          />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'line') {
    const legendTall = n > 6
    return (
      <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
        <LineChart
          data={rows}
          margin={{
            top: 8,
            right: 12,
            bottom: legendTall ? Math.min(88, 28 + n * 4) : 12,
            left: 8,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Line type="monotone" dataKey="value" stroke="var(--color-primary-container)" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'pie') {
    const pieH = fillContainer ? '100%' : 320
    return (
      <ResponsiveContainer width="100%" height={pieH} minHeight={chartMinPx}>
        <PieChart margin={{ top: 8, right: 8, bottom: Math.min(96, 12 + n * 10), left: 8 }}>
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            innerRadius={fillContainer ? 40 : 50}
            outerRadius={fillContainer ? 95 : 110}
            paddingAngle={4}
          >
            {rows.map((_entry, index) => (
              <Cell key={`slice-${index}`} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
      <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
        <XAxis type="number" dataKey="x" name="X" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
        <YAxis type="number" dataKey="y" name="Y" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="serie" data={rows} fill="var(--color-primary)" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

/**
 * Loads aggregated chart points from the API and renders the appropriate Recharts primitive.
 */
export function DashboardChartCard({
  widgetId,
  uploadId,
  suggestion,
  onRemove,
  showRemove = true,
  fillContainer = false,
}: DashboardChartCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [rows, setRows] = useState<Array<Record<string, string | number>>>([])

  const parametersKey = JSON.stringify(suggestion.parameters)

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    const cacheKey = seriesCacheKey(uploadId, suggestion.chart_type, parametersKey)
    setStatus('loading')
    ;(async () => {
      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, ms)
        })
      try {
        let response:
          | {
              data: Array<Record<string, string | number>>
            }
          | undefined
        for (let attempt = 0; attempt <= MAX_FETCH_RETRIES; attempt += 1) {
          try {
            response = await fetchChartSeries(
              {
                upload_id: uploadId,
                chart_type: suggestion.chart_type,
                parameters: suggestion.parameters,
              },
              { signal: ac.signal },
            )
            break
          } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
              throw err
            }
            if (attempt >= MAX_FETCH_RETRIES) {
              throw err
            }
            await wait(300 * (attempt + 1))
          }
        }
        if (!response) {
          throw new Error('No response data for chart series')
        }
        if (!cancelled) {
          setRows(response.data)
          saveCachedSeries(cacheKey, response.data)
          setStatus('ready')
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        console.error(err)
        if (!cancelled) {
          const cached = loadCachedSeries(cacheKey)
          if (cached && cached.length > 0) {
            setRows(cached)
            setStatus('ready')
            return
          }
          setRows([])
          setStatus('ready')
        }
      }
    })()
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [uploadId, suggestion.chart_type, parametersKey])

  return (
    <section
      className={[styles.card, fillContainer ? styles.cardFill : ''].filter(Boolean).join(' ')}
      aria-label={suggestion.title}
      data-widget-id={widgetId}
    >
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>{chartTypeLabelEs(suggestion.chart_type).toUpperCase()}</p>
          <h2 className={styles.title}>{suggestion.title}</h2>
        </div>
        {showRemove ? (
          <button type="button" className={styles.iconBtn} onClick={onRemove} aria-label="Quitar gráfico del panel">
            <MaterialIcon name="close" />
          </button>
        ) : null}
      </header>
      <p className={styles.insight}>{suggestion.insight}</p>
      <div className={[styles.chart, fillContainer ? styles.chartFill : ''].filter(Boolean).join(' ')}>
        {status === 'loading' ? <p className={styles.state}>Cargando datos agregados…</p> : null}
        {status === 'ready' && rows.length === 0 ? (
          <p className={styles.stateError}>Sin puntos suficientes para graficar.</p>
        ) : null}
        {status === 'ready' && rows.length > 0
          ? renderChart(suggestion.chart_type, rows, fillContainer, undefined)
          : null}
      </div>
    </section>
  )
}
