import type { AnalyzeResponse, ChartSeriesRequest, ChartSeriesResponse } from '../types/api'
import { assertResponseOk, GEMINI_RATE_LIMIT_ES, getApiBase, parseErrorDetailFromText } from './http'

/** While the file uploads, map 0–95%; the last 5% means "servidor e IA" until la respuesta llega. */
const UPLOAD_PROGRESS_CAP = 95

function xhrErrorMessage(xhr: XMLHttpRequest): string {
  if (xhr.status === 429) {
    return GEMINI_RATE_LIMIT_ES
  }
  return parseErrorDetailFromText(xhr.responseText || xhr.statusText)
}

/**
 * POST multipart analyze with real upload bytes progress.
 * Completion (100 %) sólo cuando el backend devuelve JSON (incluye perfilado + Gemini + persistencia).
 */
export function analyzeSpreadsheetWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<AnalyzeResponse> {
  const url = `${getApiBase()}/api/analyze`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'text'

    xhr.upload.addEventListener('progress', (e) => {
      if (!e.lengthComputable || e.total <= 0) {
        return
      }
      const ratio = Math.min(1, e.loaded / e.total)
      onProgress(Math.min(UPLOAD_PROGRESS_CAP, Math.round(UPLOAD_PROGRESS_CAP * ratio)))
    })

    xhr.addEventListener('load', () => {
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
      reject(new Error('Error de red al contactar el servidor.'))
    })

    xhr.addEventListener('abort', () => {
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
  await assertResponseOk(res, { rateLimitSpanish: GEMINI_RATE_LIMIT_ES })
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
