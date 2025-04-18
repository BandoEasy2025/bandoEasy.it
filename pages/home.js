import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple sparkline SVG component
const Sparkline = ({ trend, color = "#3b82f6", height = 24 }) => {
  // Generate random points for the sparkline
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

// Loading skeleton component for stats cards
const StatCardSkeleton = () => (
  <div className={styles.statsCard}>
    <div className={styles.statsHeader}>
      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%' }}></div>
      <div className={`${styles.skeleton} ${styles.skeletonCircle}`}></div>
    </div>
    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ height: '24px', width: '40%', marginTop: '12px' }}></div>
    <div className={`${styles.skeleton} ${styles.skeletonTextSm}`} style={{ marginTop: '12px' }}></div>
  </div>
);

export default function Dashboard() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('dashboard')
  
  // Initialize userRole state
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [bandi, setBandi] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingBandi, setLoadingBandi] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalBandi, setTotalBandi] = useState(0)
  const itemsPerPage = 10
  
  // Filter states for tutti i bandi
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [promotoreFilter, setPromotoreFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })
  const [uniquePromotori, setUniquePromotori] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Check for authentication when component mounts
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole')
    const storedUserName = localStorage.getItem('userName')
    
    setUserRole(storedUserRole)
    setUserName(storedUserName || 'User')
    
    // Only show loading for initial render
    // In a real app, this would be tied to actual data loading
    setTimeout(() => {
      setLoading(false)
    }, 800);
  }, [router])
  
  // Fetch bandi data from Supabase
  useEffect(() => {
    // Set loading state for data fetching
    if (activeItem === 'tutti-bandi') {
      setLoading(true);
      
      // Existing fetch logic
      const hasFilters = hasActiveFilters()
      if (hasFilters) {
        fetchBandiWithFilters()
      } else {
        fetchBandi()
      }
      fetchUniquePromotori()
    }
  }, [activeItem, currentPage, searchTerm, statusFilter, promotoreFilter, dateRangeFilter, itemsPerPage])
  
  // Reset filters function
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setPromotoreFilter('')
    setDateRangeFilter({ start: '', end: '' })
    setCurrentPage(1)
  }
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  // Close filters when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showFilters) {
        setShowFilters(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showFilters])
  
  // Check if we have active filters
  const hasActiveFilters = () => {
    return Object.values([statusFilter, promotoreFilter, searchTerm, dateRangeFilter.start, dateRangeFilter.end])
      .filter(Boolean).length > 0;
  }
  
  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Head>
        <title>BandoEasy - Dashboard</title>
        <meta name="description" content="BandoEasy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Stats Cards - More compact grid with 4 columns */}
      <div className={`${styles.dashboardGrid} ${styles.compactGrid}`}>
        {loading ? (
          // Show skeletons while loading
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            {userRole === 'admin' && (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            )}
          </>
        ) : (
          <>
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
                42
                <Sparkline trend="up" color="#3b82f6" />
              </div>
              <div className={styles.statsInfo}>
                <span className={styles.statsUp}>+12%</span> rispetto al mese scorso
              </div>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <h3 className={styles.statsTitle}>Le Mie Domande</h3>
                <div className={`${styles.statsIconWrapper} ${styles.statsIcon2}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
              </div>
              <div className={styles.statsValue}>
                3
                <Sparkline trend="up" color="#10b981" />
              </div>
              <div className={styles.statsInfo}>
                <span>2 in attesa, 1 approvata</span>
              </div>
            </div>
            
            {/* Admin-only stats card */}
            {userRole === 'admin' && (
              <div className={styles.statsCard}>
                <div className={styles.statsHeader}>
                  <h3 className={styles.statsTitle}>Utenti Registrati</h3>
                  <div className={`${styles.statsIconWrapper} ${styles.statsIcon3}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <div className={styles.statsValue}>
                  128
                  <Sparkline trend="up" color="#7c3aed" />
                </div>
                <div className={styles.statsInfo}>
                  <span className={styles.statsUp}>+24%</span> rispetto al mese scorso
                </div>
              </div>
            )}
            
            {/* Admin-only stats card */}
            {userRole === 'admin' && (
              <div className={styles.statsCard}>
                <div className={styles.statsHeader}>
                  <h3 className={styles.statsTitle}>Approvazioni Pendenti</h3>
                  <div className={`${styles.statsIconWrapper} ${styles.statsIcon4}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                </div>
                <div className={styles.statsValue}>
                  16
                  <Sparkline trend="down" color="#db2777" />
                </div>
                <div className={styles.statsInfo}>
                  <span className={styles.statsDown}>-8%</span> rispetto al mese scorso
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className={styles.dashboardTwoColumns}>
        {/* Admin-only Analytics Section - Now in a two-column layout */}
        {userRole === 'admin' && (
          <div className={`${styles.adminSection} ${styles.compactSection}`}>
            <h2 className={styles.sectionTitle}>Statistiche Avanzate</h2>
            
            <div className={`${styles.analyticsContainer} ${styles.compactAnalytics}`}>
              <div className={styles.analyticsCard}>
                <div className={styles.analyticsHeader}>
                  <h3>Conversione Domande</h3>
                  <div className={styles.analyticsActions}>
                    <select className={styles.analyticsSelect}>
                      <option>Ultimi 30 giorni</option>
                      <option>Ultimi 90 giorni</option>
                      <option>Quest'anno</option>
                    </select>
                  </div>
                </div>
                <div className={`${styles.chartPlaceholder} ${styles.compactChart}`}>
                  {loading ? (
                    <div className={styles.skeleton} style={{ width: '100%', height: '100%' }}></div>
                  ) : (
                    <div className={styles.mockChart}>
                      <div className={styles.mockBar} style={{ height: '65%' }}></div>
                      <div className={styles.mockBar} style={{ height: '40%' }}></div>
                      <div className={styles.mockBar} style={{ height: '80%' }}></div>
                      <div className={styles.mockBar} style={{ height: '55%' }}></div>
                      <div className={styles.mockBar} style={{ height: '75%' }}></div>
                      <div className={styles.mockBar} style={{ height: '50%' }}></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.analyticsCard}>
                <div className={styles.analyticsHeader}>
                  <h3>Distribuzione Utenti</h3>
                  <div className={styles.analyticsActions}>
                    <button className={styles.analyticsButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Esporta
                    </button>
                  </div>
                </div>
                <div className={`${styles.pieChartPlaceholder} ${styles.compactChart}`}>
                  {loading ? (
                    <div className={styles.skeleton} style={{ width: '100%', height: '100%' }}></div>
                  ) : (
                    <>
                      <div className={styles.mockPieChart}>
                        <div className={styles.mockPieSection1}></div>
                        <div className={styles.mockPieSection2}></div>
                        <div className={styles.mockPieSection3}></div>
                      </div>
                      <div className={styles.mockLegend}>
                        <div className={styles.mockLegendItem}>
                          <div className={styles.mockLegendColor1}></div>
                          <span>PMI (62%)</span>
                        </div>
                        <div className={styles.mockLegendItem}>
                          <div className={styles.mockLegendColor2}></div>
                          <span>Startup (28%)</span>
                        </div>
                        <div className={styles.mockLegendItem}>
                          <div className={styles.mockLegendColor3}></div>
                          <span>Altro (10%)</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Customer Recent Activity Section - Always visible */}
        <div className={`${styles.recentActivitySection} ${styles.compactSection}`}>
          <h2 className={styles.sectionTitle}>Attività Recenti</h2>
          
          {/* Activity list - More compact */}
          {loading ? (
            <div className={`${styles.activityList} ${styles.compactList}`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '36px', height: '36px', borderRadius: '10px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonTextSm}`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Show activities if available, otherwise show empty state */}
              {true ? ( // Replace 'true' with actual condition like 'activities.length > 0'
                <div className={`${styles.activityList} ${styles.compactList}`}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>Hai inviato una nuova domanda per il bando <strong>PNRR Digitalizzazione PMI</strong></p>
                      <span className={styles.activityTime}>2 giorni fa</span>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>La tua domanda per <strong>Bando Innovazione 2023</strong> è stata approvata</p>
                      <span className={styles.activityTime}>1 settimana fa</span>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>Richiesta di documentazione aggiuntiva per <strong>SIMEST Internazionalizzazione</strong></p>
                      <span className={styles.activityTime}>2 settimane fa</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <p>Non hai ancora attività recenti. Le tue azioni verranno visualizzate qui.</p>
                  <button className={styles.emptyStateButton}>Esplora i Bandi</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
} 