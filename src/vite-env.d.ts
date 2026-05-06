/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_AUTHOR_PORTFOLIO_URL?: string
  readonly VITE_AUTHOR_LINKEDIN_URL?: string
  readonly VITE_AUTHOR_GITHUB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
