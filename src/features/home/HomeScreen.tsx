import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './HomeScreen.module.css'

/**
 * Marketing landing (Stitch "Inicio"): hero, feature grid, trust strip, CTA.
 */
export function HomeScreen() {
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
          <nav className={styles.topNav} aria-label="Marketing">
            <a className={styles.topNavLink} href="#features">
              Funciones
            </a>
            <a className={styles.topNavLink} href="#trust">
              Clientes
            </a>
            <Link className={styles.topCta} to="/cargar-datos">
              Empezar ahora
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden />
          <div className={styles.heroInner}>
            <div className={styles.pill}>
              <MaterialIcon name="auto_awesome" className={styles.pillIcon} />
              Inteligencia artificial aplicada
            </div>
            <h1 className={styles.heroTitle}>
              Transforme sus hojas de cálculo en{' '}
              <span className={styles.heroAccent}>dashboards de elite</span>
            </h1>
            <p className={styles.heroLead}>
              Suba sus archivos CSV o Excel y deje que nuestra IA genere análisis
              profundos, visualizaciones dinámicas y reportes ejecutivos en segundos.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryBtn} to="/cargar-datos">
                Comenzar análisis
                <MaterialIcon name="arrow_forward" />
              </Link>
              <button type="button" className={styles.secondaryBtn}>
                Ver demo
              </button>
            </div>
          </div>
        </section>

        <section id="features" className={styles.bentoSection}>
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
        </section>

        <section className={styles.features} aria-labelledby="feat-heading">
          <h2 id="feat-heading" className={styles.visuallyHidden}>
            Capacidades
          </h2>
          <div className={styles.featureGrid}>
            <article className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="bolt" />
              </div>
              <h3 className={styles.featureTitle}>Instant insights</h3>
              <p className={styles.featureText}>
                Tendencias, correlaciones y valores atípicos sin escribir código.
              </p>
            </article>
            <article className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="dashboard_customize" />
              </div>
              <h3 className={styles.featureTitle}>Dashboards flexibles</h3>
              <p className={styles.featureText}>
                Personalice cada widget y construya una narrativa visual clara.
              </p>
            </article>
            <article className={styles.feature}>
              <div className={styles.featureIcon}>
                <MaterialIcon name="picture_as_pdf" />
              </div>
              <h3 className={styles.featureTitle}>Exportación pro</h3>
              <p className={styles.featureText}>
                PDF ejecutivo e informes listos para la junta directiva.
              </p>
            </article>
          </div>
        </section>

        <section id="trust" className={styles.trust}>
          <p className={styles.trustLabel}>Confiado por líderes en datos</p>
          <div className={styles.trustRow}>
            <span>Datacore</span>
            <span>Metricly</span>
            <span>Analytix</span>
            <span>Insightflow</span>
            <span>Virtue</span>
          </div>
        </section>

        <section className={styles.bottomCta}>
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
            <Link className={styles.bottomBtn} to="/cargar-datos">
              Crear proyecto
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
