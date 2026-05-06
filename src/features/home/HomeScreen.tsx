import { motion, useReducedMotion } from 'framer-motion'
import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import {
  AUTHOR_FOOTER_DISPLAY_NAME,
  AUTHOR_FOOTER_LINK_LABELS,
  AUTHOR_FOOTER_LINKS,
} from '../../config/authorFooter'
import { DATA_UPLOAD_PATH } from '../../config/nav'
import { useTheme } from '../../context/ThemeContext'
import { AuthorFooterSocialIcon } from './AuthorFooterSocialIcon'
import { landingNavAnchorClick, smoothScrollToAnchorId } from '../../lib/smoothScrollToAnchorId'
import styles from './HomeScreen.module.css'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease, delay },
  },
})

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

const cardHover = { y: -6, transition: { duration: 0.35, ease } }

/**
 * Marketing landing: Web3-style shell (stats bar, hero with orb, showcase, features, timeline, CTA).
 */
export function HomeScreen() {
  const year = new Date().getFullYear()
  const reduceMotion = useReducedMotion()
  const { theme, toggleTheme } = useTheme()

  useLayoutEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (hash !== 'features' && hash !== 'trust' && hash !== 'how') {
      return
    }
    requestAnimationFrame(() => {
      smoothScrollToAnchorId(hash)
    })
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.navBar}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand} aria-label="Análisis al Instante - inicio">
            <span className={styles.brandMark} aria-hidden>
              <MaterialIcon name="bolt" className={styles.brandBolt} />
            </span>
            <span className={styles.brandWordmark}>Análisis al Instante</span>
          </Link>

          <nav className={styles.navLinks} aria-label="Navegación principal">
            <a
              className={styles.navLink}
              href="#features"
              onClick={(e) => landingNavAnchorClick(e, 'features')}
            >
              Producto
            </a>
            <a
              className={styles.navLink}
              href="#how"
              onClick={(e) => landingNavAnchorClick(e, 'how')}
            >
              Cómo funciona
            </a>
            <a
              className={styles.navLink}
              href="#trust"
              onClick={(e) => landingNavAnchorClick(e, 'trust')}
            >
              Ventajas
            </a>
            <Link className={styles.navLink} to={DATA_UPLOAD_PATH}>
              App
            </Link>
          </nav>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
            </button>
            <Link className={styles.ctaLaunch} to={DATA_UPLOAD_PATH}>
              Lanzar app
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.statsBand} aria-label="Indicadores">
        <div className={styles.statsInner}>
          {[
            {
              label: 'Velocidad de ingesta',
              value: '< 3 s',
              hint: 'Datasets grandes',
            },
            { label: 'Modo flujo IA', value: '4 pasos', hint: 'Guiado de extremo a extremo' },
            { label: 'Widgets dinámicos', value: 'Grid', hint: 'Arrastre en vista previa' },
            { label: 'Salida ejecutiva', value: 'PDF', hint: 'Listo para compartir' },
          ].map((row) => (
            <div key={row.label} className={styles.statCell}>
              <p className={styles.statLabel}>{row.label}</p>
              <p className={styles.statValue}>{row.value}</p>
              <p className={styles.statHint}>{row.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <motion.div
              className={styles.heroCopy}
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div variants={fadeUp(0)} className={styles.heroBadge}>
                <span className={styles.liveDot} aria-hidden />
                IA en su pipeline de datos
              </motion.div>
              <motion.h1 variants={fadeUp(0.06)} className={styles.heroTitle}>
                Transforme la forma en que su{' '}
                <span className={styles.heroGradient}>equipo analiza</span>
              </motion.h1>
              <motion.p variants={fadeUp(0.1)} className={styles.heroLead}>
                Suba CSV o Excel y obtenga perfiles estadísticos, sugerencias de gráficos y un
                dashboard interactivo sin montar otro BI.
              </motion.p>
              <motion.div variants={fadeUp(0.14)} className={styles.heroBtns}>
                <Link className={styles.btnPrimary} to={DATA_UPLOAD_PATH}>
                  Comenzar gratis
                  <MaterialIcon name="arrow_forward" className={styles.btnIcon} />
                </Link>
                <a
                  className={styles.btnGhost}
                  href="#features"
                  onClick={(e) => landingNavAnchorClick(e, 'features')}
                >
                  Ver producto
                </a>
              </motion.div>
              <motion.p variants={fadeUp(0.18)} className={styles.heroFootnote}>
                <MaterialIcon name="groups" className={styles.heroFootnoteIcon} />
                Para equipos que viven entre hojas de cálculo y necesitan claridad ejecutiva rápido.
              </motion.p>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease }}
            >
              <div
                className={[styles.heroOrbWrap, reduceMotion ? '' : styles.heroOrbWrapFloat]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles.orbScene} aria-hidden>
                  <div className={styles.orbGlowBlob} />
                  {!reduceMotion ? (
                    <>
                      <div className={styles.ringSpinOuter} />
                      <div className={styles.ringSpinInner} />
                    </>
                  ) : null}
                  <div className={styles.orbCoreBurst}>
                    <MaterialIcon name="bolt" filled className={styles.orbBoltCenter} />
                  </div>
                  <div className={styles.holoCardTop}>
                    <span className={styles.holoLabel}>APY</span>
                    <span className={styles.holoValueOrange}>12.5%</span>
                  </div>
                  <div className={styles.holoCardBottom}>
                    <span className={styles.holoLabel}>Total Volume</span>
                    <span className={styles.holoValueGold}>$42.8B</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section
          id="features"
          className={`${styles.showcase} ${styles.anchorPad}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease }}
        >
          <div className={styles.sectionHead}>
            <p className={styles.sectionKicker}>Vista previa del workspace</p>
            <h2 className={styles.sectionTitle}>Un panel que se siente vivo</h2>
            <p className={styles.sectionLead}>
              Métricas, contexto de IA y un flujo claro hacia exportación.
            </p>
          </div>
          <div className={styles.showcaseGrid}>
            <div className={styles.mockCard}>
              <div className={styles.mockTop}>
                <div>
                  <h3 className={styles.mockTitle}>Resumen ejecutivo</h3>
                  <p className={styles.mockSub}>Serie agregada · última corrida</p>
                </div>
                <div className={styles.mockTools}>
                  <span className={styles.mockIconBtn}>
                    <MaterialIcon name="tune" />
                  </span>
                  <span className={styles.mockIconBtn}>
                    <MaterialIcon name="share" />
                  </span>
                </div>
              </div>
              <div className={styles.mockKpis}>
                <div className={styles.mockKpi}>
                  <span className={styles.mockKpiL}>Variación</span>
                  <span className={styles.mockKpiV}>+24.8%</span>
                </div>
                <div className={styles.mockKpi}>
                  <span className={styles.mockKpiL}>Estabilidad</span>
                  <span className={styles.mockKpiV2}>Alta</span>
                </div>
                <div className={styles.mockKpi}>
                  <span className={styles.mockKpiL}>Alertas</span>
                  <span className={styles.mockKpiE}>2</span>
                </div>
              </div>
              <div className={styles.mockChart}>
                <div className={styles.mockBars}>
                  <span className={styles.mockBar} />
                  <span className={styles.mockBar} />
                  <span className={styles.mockBar} />
                  <span className={styles.mockBar} />
                  <span className={styles.mockBar} />
                </div>
              </div>
            </div>
            <aside className={styles.showcaseAside}>
              <motion.div
                className={styles.glassPanel}
                whileHover={reduceMotion ? undefined : cardHover}
              >
                <div className={styles.glassHead}>
                  <MaterialIcon name="psychology" />
                  <span className={styles.glassTag}>IA</span>
                </div>
                <p className={styles.glassQuote}>
                  Picos inusuales en Q3; correlación fuerte con canal digital.
                </p>
                <p className={styles.glassHint}>Sugerencia prioritaria para la siguiente iteración.</p>
              </motion.div>
              <motion.div
                className={styles.glassPanelAccent}
                whileHover={reduceMotion ? undefined : cardHover}
              >
                <MaterialIcon name="upload_file" className={styles.glassBigIcon} />
                <h3 className={styles.glassH}>Carga y perfilado</h3>
                <p className={styles.glassP}>
                  Tipos inferidos, columnas clave y calidad en un solo vistazo.
                </p>
              </motion.div>
            </aside>
          </div>
        </motion.section>

        <section className={styles.features} aria-labelledby="feat-grid-title">
          <div className={styles.sectionHead}>
            <h2 id="feat-grid-title" className={styles.sectionTitle}>
              Por qué cambiar a este flujo
            </h2>
            <p className={styles.sectionLead}>
              Menos fricción entre el archivo y la historia que cuenta.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {[
              {
                icon: 'bolt',
                title: 'Respuesta inmediata',
                text: 'Perfil estadístico y primeras visualizaciones en segundos.',
              },
              {
                icon: 'dashboard_customize',
                title: 'Dashboard modular',
                text: 'Grid con arrastre, tarjetas con insight y vista publicable.',
              },
              {
                icon: 'picture_as_pdf',
                title: 'Exportación seria',
                text: 'PDF ejecutivo alineado con lo que ya validó en pantalla.',
              },
            ].map((f) => (
              <motion.article
                key={f.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease }}
                whileHover={reduceMotion ? undefined : { y: -8 }}
              >
                <span className={styles.featureWatermark} aria-hidden>
                  <MaterialIcon name={f.icon} />
                </span>
                <div className={styles.featureIcon}>
                  <MaterialIcon name={f.icon} />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureText}>{f.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="how" className={`${styles.how} ${styles.anchorPad}`} aria-labelledby="how-title">
          <div className={styles.sectionHead}>
            <h2 id="how-title" className={styles.sectionTitle}>
              Cómo funciona
            </h2>
            <p className={styles.sectionLead}>Cuatro pasos. Un solo flujo continuo en la app.</p>
          </div>
          <ol className={styles.timeline}>
            {[
              {
                step: '01',
                title: 'Conecte sus datos',
                body: 'CSV o Excel al servidor; validación y perfilado automático.',
              },
              {
                step: '02',
                title: 'Ajuste el mapeo',
                body: 'Confirme columnas, tipos y exclusiones según su criterio.',
              },
              {
                step: '03',
                title: 'Deje trabajar a la IA',
                body: 'Propuestas de gráficos con parámetros sensatos por defecto.',
              },
            ].map((item, i) => (
              <li key={item.step} className={i % 2 === 0 ? styles.timelineRow : styles.timelineRowAlt}>
                <div className={styles.timelineNode} aria-hidden>
                  <span>{item.step}</span>
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.cornerTL} aria-hidden />
                  <span className={styles.cornerBR} aria-hidden />
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="trust"
          className={`${styles.trust} ${styles.anchorPad}`}
          aria-labelledby="trust-heading"
        >
          <p className={styles.trustKicker}>Ventajas operativas</p>
          <h2 id="trust-heading" className={styles.trustTitle}>
            Diseñado para equipos que no quieren otro proyecto de BI de seis meses
          </h2>
          <ul className={styles.trustGrid}>
            {[
              {
                icon: 'dashboard',
                lead: 'Sin setup eterno',
                text: 'Arranque con el archivo que ya usa; el valor es el primer análisis.',
              },
              {
                icon: 'psychology',
                lead: 'Sin adivinar el gráfico',
                text: 'Sugerencias basadas en el perfil real de columnas y cardinalidad.',
              },
              {
                icon: 'cloud_done',
                lead: 'Procesamiento en servidor',
                text: 'Agregaciones y persistencia del lado servidor; el cliente pide series listas.',
              },
            ].map((t) => (
              <li key={t.lead} className={styles.trustCard}>
                <span className={styles.trustIcon}>
                  <MaterialIcon name={t.icon} />
                </span>
                <strong className={styles.trustLead}>{t.lead}</strong>
                <p className={styles.trustText}>{t.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <motion.section
          className={styles.finalCta}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className={styles.finalCtaInner}>
            <h2 className={styles.finalTitle}>¿Listo para el siguiente nivel?</h2>
            <p className={styles.finalLead}>
              Entre al flujo guiado: carga, configuración, IA y vista previa en un solo workspace.
            </p>
            <Link className={styles.finalBtn} to={DATA_UPLOAD_PATH}>
              Abrir workspace
            </Link>
          </div>
        </motion.section>
      </main>

      <footer className={styles.siteFooter}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerBrand}>
              <span className={styles.brandMark} aria-hidden>
                <MaterialIcon name="bolt" className={styles.brandBolt} />
              </span>
              <span className={styles.footerBrandName}>Análisis al Instante</span>
            </div>
            <p className={styles.footerTagline}>De la hoja de cálculo al informe, sin fricción.</p>
            <time className={styles.footerCopy} dateTime={String(year)}>
              © {year} {AUTHOR_FOOTER_DISPLAY_NAME}
            </time>
          </div>
          <div className={styles.footerLinks}>
            <p className={styles.footerHeading}>Explorar</p>
            <a href="#features" className={styles.footerLink}>
              Producto
            </a>
            <a href="#how" className={styles.footerLink}>
              Cómo funciona
            </a>
            <Link to={DATA_UPLOAD_PATH} className={styles.footerLink}>
              App
            </Link>
          </div>
          <div className={styles.footerSocial}>
            <p className={styles.footerHeading}>Contacto</p>
            {AUTHOR_FOOTER_LINKS.length ? (
              <nav aria-label="Redes">
                <ul className={styles.socialList}>
                  {AUTHOR_FOOTER_LINKS.map(({ kind, href }) => (
                    <li key={kind}>
                      <a
                        href={href}
                        className={styles.socialLink}
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
            ) : (
              <p className={styles.footerMuted}>Configure enlaces en el entorno del proyecto.</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
