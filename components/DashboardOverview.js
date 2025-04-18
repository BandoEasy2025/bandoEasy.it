import { useState, useEffect } from 'react';
import styles from '../styles/DashboardOverview.module.css';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple sparkline SVG component
const Sparkline = ({ trend, color = "#4dabf7", height = 20 }) => {
  // Generate points for the sparkline
  const points = trend === 'up' 
    ? "0,24 5,18 10,20 15,14 20,16 25,10 30,6 35,8 40,4 45,0 50,2"
    : "0,0 5,4 10,2 15,8 20,6 25,12 30,10 35,14 40,18 45,16 50,24";
  
  return (
    <svg className={styles.sparkline} width="50" height={height} viewBox="0 0 50 24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

export default function DashboardOverview() {
  const [bandiStats, setBandiStats] = useState({
    open: { count: 0, change: 0 },
    closed: { count: 0, change: 0 },
    upcoming: { count: 0, change: 0 },
    total: { count: 0, change: 0 }
  });
  const [applications, setApplications] = useState({
    submitted: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  });
  const [fundingByRegion, setFundingByRegion] = useState([]);
  const [fundingBySector, setFundingBySector] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // Mock data for testing
      setBandiStats({
        open: { count: 42, change: 12 },
        closed: { count: 18, change: -5 },
        upcoming: { count: 15, change: 20 },
        total: { count: 75, change: 8 }
      });
      
      setApplications({
        submitted: 2,
        reviewing: 1,
        approved: 3,
        rejected: 1
      });
      
      setFundingByRegion([
        { name: 'Lombardia', amount: 5200000 },
        { name: 'Lazio', amount: 4100000 },
        { name: 'Veneto', amount: 3800000 },
        { name: 'Emilia-Romagna', amount: 3300000 },
        { name: 'Campania', amount: 2900000 }
      ]);
      
      setFundingBySector([
        { name: 'Innovazione Digitale', amount: 6500000 },
        { name: 'Sostenibilità', amount: 5200000 },
        { name: 'Agricoltura', amount: 3800000 },
        { name: 'Turismo', amount: 2900000 },
        { name: 'Manifattura', amount: 2100000 }
      ]);
      
      setRecommendations([
        { id: 1, title: 'Incentivi alle imprese per la transizione digitale', match: 94, deadline: '2023-12-15' },
        { id: 2, title: 'Finanziamenti per start-up innovative', match: 87, deadline: '2023-11-30' },
        { id: 3, title: 'Sostegno alle PMI del settore agroalimentare', match: 83, deadline: '2023-12-10' }
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Format date for timeline
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
  };

  return (
    <div className={styles.dashboardOverviewContainer}>
      {/* 1. Funding Opportunity Overview */}
      <section className={styles.overviewSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Panoramica Opportunità di Finanziamento</h2>
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Tutti
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'region' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('region')}
            >
              Per Regione
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'sector' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('sector')}
            >
              Per Settore
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Bandi Aperti</h3>
              <div className={`${styles.statsIconWrapper} ${styles.statsIcon1}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
            <div className={styles.statsValue}>
              {loading ? '...' : bandiStats.open.count}
              <Sparkline trend="up" color="#4dabf7" />
            </div>
            <div className={styles.statsInfo}>
              <span className={styles.statsUp}>+{loading ? '...' : bandiStats.open.change}%</span> rispetto al mese scorso
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Bandi in Scadenza</h3>
              <div className={`${styles.statsIconWrapper} ${styles.statsIcon2}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className={styles.statsValue}>
              {loading ? '...' : bandiStats.upcoming.count}
              <Sparkline trend="up" color="#69db7c" />
            </div>
            <div className={styles.statsInfo}>
              <span className={styles.statsUp}>+{loading ? '...' : bandiStats.upcoming.change}%</span> nuovi in arrivo
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Bandi Chiusi</h3>
              <div className={`${styles.statsIconWrapper} ${styles.statsIcon3}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
              </div>
            </div>
            <div className={styles.statsValue}>
              {loading ? '...' : bandiStats.closed.count}
              <Sparkline trend="down" color="#a5d8ff" />
            </div>
            <div className={styles.statsInfo}>
              <span className={styles.statsDown}>{loading ? '...' : bandiStats.closed.change}%</span> rispetto al mese scorso
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Totale Bandi</h3>
              <div className={`${styles.statsIconWrapper} ${styles.statsIcon4}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
            <div className={styles.statsValue}>
              {loading ? '...' : bandiStats.total.count}
              <Sparkline trend="up" color="#ffa8a8" />
            </div>
            <div className={styles.statsInfo}>
              <span className={styles.statsUp}>+{loading ? '...' : bandiStats.total.change}%</span> rispetto al mese scorso
            </div>
          </div>
        </div>
      </section>

      {/* 2. Application Status and Timeline */}
      <div className={styles.dashboardTwoColumns}>
        {/* Left Column: Application Status */}
        <section className={styles.applicationStatusSection}>
          <h2 className={styles.sectionTitle}>Stato delle Domande</h2>
          <div className={styles.applicationStatusContainer}>
            <div className={styles.applicationStatusHeader}>
              <div className={styles.statusTotal}>
                <span className={styles.statusTotalNumber}>{loading ? '...' : applications.submitted + applications.reviewing + applications.approved + applications.rejected}</span>
                <span className={styles.statusTotalLabel}>Domande Totali</span>
              </div>
            </div>
            
            <div className={styles.applicationStatusGrid}>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon} data-status="submitted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className={styles.statusContent}>
                  <div className={styles.statusCount}>{loading ? '...' : applications.submitted}</div>
                  <div className={styles.statusLabel}>Inviate</div>
                </div>
              </div>
              
              <div className={styles.statusItem}>
                <div className={styles.statusIcon} data-status="reviewing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className={styles.statusContent}>
                  <div className={styles.statusCount}>{loading ? '...' : applications.reviewing}</div>
                  <div className={styles.statusLabel}>In Revisione</div>
                </div>
              </div>
              
              <div className={styles.statusItem}>
                <div className={styles.statusIcon} data-status="approved">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className={styles.statusContent}>
                  <div className={styles.statusCount}>{loading ? '...' : applications.approved}</div>
                  <div className={styles.statusLabel}>Approvate</div>
                </div>
              </div>
              
              <div className={styles.statusItem}>
                <div className={styles.statusIcon} data-status="rejected">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className={styles.statusContent}>
                  <div className={styles.statusCount}>{loading ? '...' : applications.rejected}</div>
                  <div className={styles.statusLabel}>Respinte</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Upcoming Deadlines */}
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Scadenze Imminenti</h2>
          <div className={styles.timelineContainer}>
            <div className={styles.timelineList}>
              {loading ? (
                <div className={styles.loading}>Caricamento...</div>
              ) : (
                <>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDate}>
                      <span className={styles.timelineDay}>15</span>
                      <span className={styles.timelineMonth}>Dic</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>Incentivi alle imprese per la transizione digitale</h3>
                      <span className={styles.timelineBadge} data-status="open">Aperto</span>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDate}>
                      <span className={styles.timelineDay}>10</span>
                      <span className={styles.timelineMonth}>Dic</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>Sostegno alle PMI del settore agroalimentare</h3>
                      <span className={styles.timelineBadge} data-status="open">Aperto</span>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDate}>
                      <span className={styles.timelineDay}>30</span>
                      <span className={styles.timelineMonth}>Nov</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>Finanziamenti per start-up innovative</h3>
                      <span className={styles.timelineBadge} data-status="open">Aperto</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={styles.viewAllLink}>
              <a href="/tutti-bandi?sort=deadline">Vedi tutte le scadenze</a>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Funding Analytics */}
      <section className={styles.fundingAnalyticsSection}>
        <h2 className={styles.sectionTitle}>Analisi Finanziamenti</h2>
        <div className={styles.fundingCharts}>
          <div className={styles.fundingChart}>
            <h3 className={styles.chartTitle}>Finanziamenti per Regione (Top 5)</h3>
            <div className={styles.chartContainer}>
              {loading ? (
                <div className={styles.loading}>Caricamento...</div>
              ) : (
                <div className={styles.barChart}>
                  {fundingByRegion.map((region, index) => (
                    <div key={index} className={styles.barChartItem}>
                      <div className={styles.barLabel}>{region.name}</div>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.bar} 
                          style={{ 
                            width: `${(region.amount / Math.max(...fundingByRegion.map(r => r.amount))) * 100}%`,
                            backgroundColor: `hsl(${200 + index * 15}, 75%, 70%)`
                          }}
                        ></div>
                        <div className={styles.barValue}>€{(region.amount / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.fundingChart}>
            <h3 className={styles.chartTitle}>Finanziamenti per Settore (Top 5)</h3>
            <div className={styles.chartContainer}>
              {loading ? (
                <div className={styles.loading}>Caricamento...</div>
              ) : (
                <div className={styles.barChart}>
                  {fundingBySector.map((sector, index) => (
                    <div key={index} className={styles.barChartItem}>
                      <div className={styles.barLabel}>{sector.name}</div>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.bar} 
                          style={{ 
                            width: `${(sector.amount / Math.max(...fundingBySector.map(s => s.amount))) * 100}%`,
                            backgroundColor: `hsl(${100 + index * 15}, 65%, 75%)`
                          }}
                        ></div>
                        <div className={styles.barValue}>€{(sector.amount / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Personalized Recommendations */}
      <section className={styles.recommendationsSection}>
        <h2 className={styles.sectionTitle}>Bandi Consigliati per Te</h2>
        <div className={styles.recommendationsContainer}>
          {loading ? (
            <div className={styles.loading}>Caricamento...</div>
          ) : (
            <>
              {recommendations.map((bando) => (
                <div key={bando.id} className={styles.recommendationCard}>
                  <div className={styles.recommendationHeader}>
                    <div className={styles.matchScore} style={{ 
                      background: `conic-gradient(#74c0fc ${bando.match}%, #e5e7eb ${bando.match}% 100%)` 
                    }}>
                      <div className={styles.matchScoreInner}>{bando.match}%</div>
                    </div>
                    <div className={styles.recommendationMeta}>
                      <span className={styles.recommendationDeadline}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Scade il {formatDate(bando.deadline)}
                      </span>
                    </div>
                  </div>
                  <h3 className={styles.recommendationTitle}>{bando.title}</h3>
                  <div className={styles.recommendationActions}>
                    <button className={styles.recommendationButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Dettagli
                    </button>
                    <button className={styles.recommendationButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8 17 12 21 16 17" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
                      </svg>
                      Salva
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* 5. Quick Actions */}
      <section className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>Azioni Rapide</h2>
        <div className={styles.quickActionsContainer}>
          <button className={styles.quickActionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Cerca bandi</span>
          </button>
          
          <button className={styles.quickActionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Crea nuova domanda</span>
          </button>
          
          <button className={styles.quickActionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Esporta report</span>
          </button>
          
          <button className={styles.quickActionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Bandi salvati</span>
          </button>
        </div>
      </section>
    </div>
  );
} 