import { motion } from 'framer-motion'
import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import {
  AUTHOR_FOOTER_DISPLAY_NAME,
  AUTHOR_FOOTER_LINK_LABELS,
  AUTHOR_FOOTER_LINKS,
} from '../../config/authorFooter'
import { AuthorFooterSocialIcon } from './AuthorFooterSocialIcon'
import { DATA_UPLOAD_PATH } from '../../config/nav'
import { landingNavAnchorClick, smoothScrollToAnchorId } from '../../lib/smoothScrollToAnchorId'
import styles from './HomeScreen.module.css'

const easeOutStrong = [0.22, 1, 0.36, 1] as const

const heroEnter = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.88, ease: easeOutStrong },
  },
}

const sectionRevealOnce = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.74, ease: easeOutStrong },
  },
}

const featureGridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
}

const featureCardItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: easeOutStrong },
  },
}

const trustListContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
}

const trustListItem = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.62, ease: easeOutStrong },
  },
}

/**
 * Marketing landing: hero, feature grid, value proposition (#trust), CTA.
 */
export function HomeScreen() {
  const year = new Date().getFullYear()

  useLayoutEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (hash !== 'features' && hash !== 'trust') {
      return
    }
    requestAnimationFrame(() => {
      smoothScrollToAnchorId(hash)
    })
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topInner}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>
              <MaterialIcon name="psychology" filled className={styles.logoIcon} />
            </div>
            <span className={styles.logoText}>Análisis al Instante</span>
          </div>
          <nav className={styles.topNav} aria-label="Navegación de la página de inicio">
            <a
              className={styles.topNavLink}
              href="#features"
              onClick={(e) => landingNavAnchorClick(e, 'features')}
            >
              Funciones
            </a>
            <a
              className={styles.topNavLink}
              href="#trust"
              onClick={(e) => landingNavAnchorClick(e, 'trust')}
            >
              Ventajas
            </a>
            <Link className={styles.topCta} to={DATA_UPLOAD_PATH}>
              Empezar ahora
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <motion.section
          className={styles.hero}
          initial="hidden"
          animate="show"
          variants={heroEnter}
        >
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroInner}>
            <div className={styles.pill}>
              <MaterialIcon name="auto_awesome" className={styles.pillIcon} />
              Inteligencia artificial aplicada
            </div>
            <h1 className={styles.heroTitle}>
              Transforme sus hojas de cálculo en{' '}
              <span className={styles.heroAccent}>dashboards inteligentes</span>
            </h1>
            <p className={styles.heroLead}>
              Suba sus archivos CSV o Excel y deje que nuestra IA genere análisis
              profundos, visualizaciones dinámicas y reportes ejecutivos en segundos.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryBtn} to={DATA_UPLOAD_PATH}>
                Comenzar análisis
                <MaterialIcon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="features"
          className={`${styles.bentoSection} ${styles.anchorTarget}`}
          variants={sectionRevealOnce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.14, margin: '-72px 0px 0px 0px' }}
        >
          <div className={styles.bentoGrid}>
            <div className={styles.bentoMain}>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <div>
                    <h2 className={styles.previewTitle}>Resumen ejecutivo de ventas</h2>
                    <p className={styles.previewSub}>Datos actualizados hace 2 minutos</p>
                  </div>
                  <div className={styles.previewTools}>
                    <span className={styles.iconBtn}>
                      <MaterialIcon name="filter_list" />
                    </span>
                    <span className={styles.iconBtn}>
                      <MaterialIcon name="share" />
                    </span>
                  </div>
                </div>
                <div className={styles.kpiRow}>
                  <div className={styles.kpi}>
                    <p className={styles.kpiLabel}>ROI total</p>
                    <p className={styles.kpiValue}>+24.8%</p>
                  </div>
                  <div className={styles.kpi}>
                    <p className={styles.kpiLabel}>Conversión</p>
                    <p className={styles.kpiValueDark}>12.5%</p>
                  </div>
                  <div className={styles.kpi}>
                    <p className={styles.kpiLabel}>Churn rate</p>
                    <p className={styles.kpiError}>1.2%</p>
                  </div>
                </div>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartBars} aria-hidden>
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                  </div>
                </div>
              </div>
            </div>
            <aside className={styles.bentoAside}>
              <div className={styles.aiCard}>
                <div className={styles.aiCardHead}>
                  <MaterialIcon name="psychology" filled />
                  <span className={styles.aiPill}>AI insight</span>
                </div>
                <p className={styles.aiQuote}>
                  Se detectó una anomalía positiva en el segmento corporativo durante
                  el último trimestre.
                </p>
                <p className={styles.aiHint}>
                  Recomendación: incrementar el presupuesto en LinkedIn un 15% en el
                  sector tecnológico.
                </p>
              </div>
              <div className={styles.uploadTeaser}>
                <div className={styles.uploadIconWrap}>
                  <MaterialIcon name="upload_file" className={styles.uploadIcon} />
                </div>
                <h3 className={styles.uploadTitle}>Procesado al instante</h3>
                <p className={styles.uploadText}>
                  Más de 500k filas en menos de 3 segundos con precisión consistente.
                </p>
              </div>
            </aside>
          </div>
        </motion.section>

        <section className={styles.features} aria-labelledby="feat-heading">
          <h2 id="feat-heading" className={styles.visuallyHidden}>
            Capacidades
          </h2>
          <motion.div
            className={styles.featureGrid}
            variants={featureGridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
          >
            <motion.article variants={featureCardItem} className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="bolt" />
              </div>
              <h3 className={styles.featureTitle}>Análisis instantáneos</h3>
              <p className={styles.featureText}>
                Tendencias, correlaciones y valores atípicos sin escribir código.
              </p>
            </motion.article>
            <motion.article variants={featureCardItem} className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="dashboard_customize" />
              </div>
              <h3 className={styles.featureTitle}>Dashboards flexibles</h3>
              <p className={styles.featureText}>
                Personalice cada widget y construya una narrativa visual clara.
              </p>
            </motion.article>
            <motion.article variants={featureCardItem} className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="picture_as_pdf" />
              </div>
              <h3 className={styles.featureTitle}>Exportación fácil</h3>
              <p className={styles.featureText}>
                PDF ejecutivo y más formatos listos para compartir.
              </p>
            </motion.article>
          </motion.div>
        </section>

        <section
          id="trust"
          className={`${styles.trust} ${styles.anchorTarget}`}
          aria-labelledby="trust-heading"
        >
          <motion.p
            className={styles.trustLabel}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{ duration: 0.5, ease: easeOutStrong }}
          >
            Qué deja de frenarle el análisis
          </motion.p>
          <motion.h2
            id="trust-heading"
            className={styles.trustTitle}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{ duration: 0.58, delay: 0.04, ease: easeOutStrong }}
          >
            Un atajo serio para equipos que viven en Excel, sin montar un BI completo
          </motion.h2>
          <motion.ul
            className={styles.trustList}
            variants={trustListContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14, margin: '-64px 0px' }}
          >
            <motion.li variants={trustListItem} className={styles.trustItem}>
              <span className={styles.trustItemMark} aria-hidden>
                <MaterialIcon name="dashboard" className={styles.trustItemIcon} />
              </span>
              <div className={styles.trustItemBody}>
                <strong className={styles.trustItemLead}>Sin el setup eterno del BI</strong>
                <p className={styles.trustItemText}>
                  No hace falta modelar un universo semántico ni mover a toda la organización a otra
                  suite: el valor arranca con el CSV o Excel que ya usa hoy.
                </p>
              </div>
            </motion.li>
            <motion.li variants={trustListItem} className={styles.trustItem}>
              <span className={styles.trustItemMark} aria-hidden>
                <MaterialIcon name="psychology" className={styles.trustItemIcon} />
              </span>
              <div className={styles.trustItemBody}>
                <strong className={styles.trustItemLead}>Sin adivinar qué conviene graficar</strong>
                <p className={styles.trustItemText}>
                  La IA propone vistas a partir del perfil real de sus columnas (tipos, rangos y
                  categorías), no desde plantillas vacías que ignoran su dataset.
                </p>
              </div>
            </motion.li>
            <motion.li variants={trustListItem} className={styles.trustItem}>
              <span className={styles.trustItemMark} aria-hidden>
                <MaterialIcon name="cloud_done" className={styles.trustItemIcon} />
              </span>
              <div className={styles.trustItemBody}>
                <strong className={styles.trustItemLead}>Sin arrastrar todo el archivo al navegador</strong>
                <p className={styles.trustItemText}>
                  El procesamiento y la persistencia ocurren en el servidor; el panel pide series ya
                  agregadas, lista para un despliegue con datos reales.
                </p>
              </div>
            </motion.li>
          </motion.ul>
        </section>

        <motion.section
          className={styles.bottomCta}
          variants={sectionRevealOnce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className={styles.bottomCtaInner}>
            <div>
              <h2 className={styles.bottomTitle}>
                ¿Listo para desbloquear el poder de sus datos?
              </h2>
              <p className={styles.bottomLead}>
                Únase a analistas que ya transformaron su flujo con Análisis al
                Instante.
              </p>
            </div>
            <Link className={styles.bottomBtn} to={DATA_UPLOAD_PATH}>
              Crear proyecto
            </Link>
          </div>
        </motion.section>
      </main>

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <div className={styles.siteFooterBrand}>
            <time className={styles.siteFooterCopy} dateTime={String(year)}>
              © {year}
            </time>
            <span className={styles.siteFooterName}>{AUTHOR_FOOTER_DISPLAY_NAME}</span>
          </div>
          {AUTHOR_FOOTER_LINKS.length ? (
            <nav className={styles.siteFooterNav} aria-label="Autoría y redes del proyecto">
              <ul className={styles.siteFooterList}>
                {AUTHOR_FOOTER_LINKS.map(({ kind, href }) => (
                  <li key={kind}>
                    <a
                      href={href}
                      className={styles.siteFooterLink}
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
        </div>
      </footer>
    </div>
  )
}
