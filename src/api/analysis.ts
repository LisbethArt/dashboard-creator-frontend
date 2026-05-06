import type { AnalyzeResponse, ChartSeriesRequest, ChartSeriesResponse } from '../types/api'
import {
  assertResponseOk,
  GEMINI_RATE_LIMIT_ES,
  GEMINI_UNAVAILABLE_ES,
  getApiBase,
  parseErrorDetailFromText,
} from './http'

/** Upload maps to [1, UPLOAD_PROGRESS_CAP]; server work fills until JSON resolves at 100%. */
const UPLOAD_PROGRESS_CAP = 95

/**
 * Coalesces frequent xhr.upload progress events to one React-friendly update per animation frame.
 */
function createProgressBatcher(report: (percent: number) => void) {
  let rafId = 0
  let pending = -1

  const flush = () => {
    rafId = 0
    if (pending < 0) {
      return
    }
    const value = pending
    pending = -1
    report(value)
  }

  const schedule = (percent: number) => {
    pending = percent
    if (rafId === 0) {
      rafId = requestAnimationFrame(flush)
    }
  }

  const flushNow = () => {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    flush()
  }

  return { schedule, flushNow }
}

function xhrErrorMessage(xhr: XMLHttpRequest): string {
  if (xhr.status === 429) {
    const detail = parseErrorDetailFromText(xhr.responseText || xhr.statusText).trim()
    if (detail.length > 0) {
      return detail
    }
    return GEMINI_RATE_LIMIT_ES
  }
  if (xhr.status === 503) {
    const detail = parseErrorDetailFromText(xhr.responseText || xhr.statusText).trim()
    if (detail.length > 0) {
      return detail
    }
    return GEMINI_UNAVAILABLE_ES
  }
  return parseErrorDetailFromText(xhr.responseText || xhr.statusText)
}

/**
 * POST multipart analyze with real upload bytes progress (XMLHttpRequest).
 * Completion at 100% only after the backend returns JSON (profiling + LLM + persistence).
 */
export function analyzeSpreadsheetWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<AnalyzeResponse> {
  const url = `${getApiBase()}/api/analyze`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'text'
    const batch = createProgressBatcher(onProgress)

    const uploadPercentFromLoadedTotal = (loaded: number, total: number) => {
      if (total <= 0 || loaded < 0) {
        return null
      }
      const ratio = Math.min(1, loaded / total)
      return Math.min(UPLOAD_PROGRESS_CAP, Math.max(1, Math.round(UPLOAD_PROGRESS_CAP * ratio)))
    }

    xhr.upload.addEventListener('loadstart', () => {
      batch.schedule(1)
    })

    xhr.upload.addEventListener('progress', (e) => {
      let pct: number | null = null
      if (e.lengthComputable && e.total > 0) {
        pct = uploadPercentFromLoadedTotal(e.loaded, e.total)
      } else if (file.size > 0 && e.loaded > 0) {
        const approxRatio = Math.min(1, e.loaded / file.size)
        pct = Math.min(UPLOAD_PROGRESS_CAP, Math.max(1, Math.round(UPLOAD_PROGRESS_CAP * approxRatio)))
      }
      if (pct !== null) {
        batch.schedule(pct)
      }
    })

    xhr.upload.addEventListener('loadend', () => {
      batch.schedule(UPLOAD_PROGRESS_CAP)
    })

    xhr.addEventListener('load', () => {
      batch.flushNow()
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        try {
          resolve(JSON.parse(xhr.responseText) as AnalyzeResponse)
        } catch {
          reject(new Error('Respuesta inválida del servidor.'))
        }
        return
      }
      reject(new Error(xhrErrorMessage(xhr)))
    })

    xhr.addEventListener('error', () => {
      batch.flushNow()
      reject(new Error('Error de red al contactar el servidor.'))
    })

    xhr.addEventListener('abort', () => {
      batch.flushNow()
      reject(new Error('Carga cancelada.'))
    })

    xhr.open('POST', url)
    const form = new FormData()
    form.append('file', file)
    xhr.send(form)
  })
}

/**
 * Uploads a spreadsheet and returns structured chart suggestions produced by the LLM pipeline.
 */
export async function analyzeSpreadsheet(file: File): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${getApiBase()}/api/analyze`, {
    method: 'POST',
    body: form,
  })
  await assertResponseOk(res, {
    rateLimitSpanish: GEMINI_RATE_LIMIT_ES,
    unavailableSpanish: GEMINI_UNAVAILABLE_ES,
  })
  return res.json() as Promise<AnalyzeResponse>
}

/**
 * Fetches aggregated rows for a single chart without shipping the full dataset to the browser.
 */
export async function fetchChartSeries(
  body: ChartSeriesRequest,
  init?: RequestInit,
): Promise<ChartSeriesResponse> {
  const res = await fetch(`${getApiBase()}/api/charts/series`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...init,
  })
  await assertResponseOk(res)
  return res.json() as Promise<ChartSeriesResponse>
}
