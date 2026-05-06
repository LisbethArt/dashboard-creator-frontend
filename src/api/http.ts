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

/** Short Spanish copy when Gemini returns HTTP 429 (quota / rate limit). */
export const GEMINI_RATE_LIMIT_ES =
  'Cuota o límite de la API de Gemini alcanzado. Espera uno o dos minutos o revisa tu plan en Google AI Studio (https://aistudio.google.com). En el servidor pon GEMINI_MODEL=gemini-2.5-flash-lite en .env (modelo económico recomendado) y reinicia Uvicorn.'

export async function assertResponseOk(
  res: Response,
  options?: { rateLimitSpanish?: string },
): Promise<void> {
  if (res.ok) {
    return
  }
  if (res.status === 429 && options?.rateLimitSpanish) {
    throw new Error(options.rateLimitSpanish)
  }
  throw new Error(await readErrorDetail(res))
}
