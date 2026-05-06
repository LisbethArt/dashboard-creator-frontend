const trimUrl = (v: string | undefined): string =>
  typeof v === 'string' ? v.trim() : ''

export type AuthorFooterLinkKey = 'portfolio' | 'linkedin' | 'github'

/** Display name shown on the landing page footer (no env). */
export const AUTHOR_FOOTER_DISPLAY_NAME = 'Lisbeth Argueta'

/** Accessible names for icon-only footer links (Spanish). */
export const AUTHOR_FOOTER_LINK_LABELS: Record<AuthorFooterLinkKey, string> = {
  portfolio: 'Portafolio',
  linkedin: 'LinkedIn',
  github: 'GitHub',
}

const raw: ReadonlyArray<readonly [AuthorFooterLinkKey, string]> = [
  ['portfolio', trimUrl(import.meta.env.VITE_AUTHOR_PORTFOLIO_URL)],
  ['linkedin', trimUrl(import.meta.env.VITE_AUTHOR_LINKEDIN_URL)],
  ['github', trimUrl(import.meta.env.VITE_AUTHOR_GITHUB_URL)],
]

/**
 * External profiles for the home footer.
 * Set the `VITE_AUTHOR_*` variables in `.env` (see `.env.example`).
 */
export const AUTHOR_FOOTER_LINKS: ReadonlyArray<{ kind: AuthorFooterLinkKey; href: string }> = raw
  .filter(([, href]) => href.length > 0)
  .map(([kind, href]) => ({ kind, href }))
