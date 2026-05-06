import {
  AUTHOR_FOOTER_LINK_LABELS,
  AUTHOR_FOOTER_LINKS,
} from '../../config/authorFooter'
import { AuthorFooterSocialIcon } from '../../features/home/AuthorFooterSocialIcon'
import styles from './PortalFooter.module.css'

/**
 * Workspace-wide footer; mirrors home social links when env URLs are set.
 */
export function PortalFooter() {
  return (
    <footer className={styles.root}>
      <p className={styles.meta}>Análisis al Instante · Lisbeth Argueta</p>
      {AUTHOR_FOOTER_LINKS.length ? (
        <nav className={styles.nav} aria-label="Autoría y redes del proyecto">
          <ul className={styles.list}>
            {AUTHOR_FOOTER_LINKS.map(({ kind, href }) => (
              <li key={kind}>
                <a
                  href={href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={AUTHOR_FOOTER_LINK_LABELS[kind]}
                >
                  <AuthorFooterSocialIcon kind={kind} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </footer>
  )
}
