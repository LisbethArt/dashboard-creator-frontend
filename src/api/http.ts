/**
 * Returns the API origin for browser calls, trimming trailing slashes.
 *
 * Defaults to `http://localhost:8000` when `VITE_API_URL` is unset so local development works
 * without an extra env file.
 */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL
  const chosen =
    typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : 'http://localhost:8000'
  return chosen.replace(/\/$/, '')
}

/**
 * Parses a FastAPI-style JSON error body (field `detail`) from raw text synchronously.
 */
export function parseErrorDetailFromText(text: string): string {
  try {
    const parsed = JSON.parse(text) as { detail?: unknown }
    if (typeof parsed.detail === 'string') {
      return parsed.detail
    }
    if (Array.isArray(parsed.detail)) {
      return parsed.detail.map((d) => String(d)).join('; ')
    }
  } catch {
    /* response was not JSON */
  }
  const trimmed = text.trim()
  return trimmed.length > 0 ? trimmed : 'Solicitud rechazada por el servidor.'
}

export async function readErrorDetail(res: Response): Promise<string> {
  const text = await res.text()
  return parseErrorDetailFromText(text)
}

/** Spanish copy when analyze hits HTTP 429 after exhausting Gemini model fallbacks on the server. */
export const GEMINI_RATE_LIMIT_ES =
  'Cuota o límite de la API de Gemini alcanzado en todos los modelos probados automáticamente en el servidor (económicos primero y, en última instancia, modelos más potentes). Espere uno o dos minutos o revise su plan en Google AI Studio (https://aistudio.google.com).'

export async function assertResponseOk(
  res: Response,
  options?: { rateLimitSpanish?: string },
): Promise<void> {
  if (res.ok) {
    return
  }
  if (res.status === 429 && options?.rateLimitSpanish) {
    const detail = (await readErrorDetail(res)).trim()
    throw new Error(detail.length > 0 ? detail : options.rateLimitSpanish)
  }
  throw new Error(await readErrorDetail(res))
}
