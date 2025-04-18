import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Dashboard() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('dashboard')
  
  // Initialize userRole state
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [bandi, setBandi] = useState([])
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
  }, [router])
  
  // Fetch bandi data from Supabase
  useEffect(() => {
    async function fetchBandi() {
      try {
        setLoadingBandi(true)
        
        // Basic query to get all bandi
        const { data, error } = await supabase
          .from('bandi')
          .select('id, nome_bando, promotore, scadenza, stato')
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        
        if (error) {
          console.error('Error fetching bandi:', error)
          return
        }
        
        console.log('Fetched bandi:', data)
        setBandi(data || [])
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('bandi')
          .select('id', { count: 'exact', head: true })
        
        if (countError) {
          console.error('Error fetching bandi count:', countError)
        } else {
          setTotalBandi(count || 0)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoadingBandi(false)
      }
    }
    
    // More complex query with filters
    async function fetchBandiWithFilters() {
      try {
        setLoadingBandi(true)
        
        // Build query with filters
        let query = supabase
          .from('bandi')
          .select('id, nome_bando, promotore, scadenza, stato')
        
        // Apply search filter
        if (searchTerm) {
          query = query.or(`nome_bando.ilike.%${searchTerm}%,promotore.ilike.%${searchTerm}%`)
        }
        
        // Apply status filter
        if (statusFilter) {
          query = query.eq('stato', statusFilter)
        }
        
        // Apply promotore filter
        if (promotoreFilter) {
          query = query.eq('promotore', promotoreFilter)
        }
        
        // Apply date range filter
        if (dateRangeFilter.start) {
          query = query.gte('scadenza', dateRangeFilter.start)
        }
        if (dateRangeFilter.end) {
          query = query.lte('scadenza', dateRangeFilter.end)
        }
        
        // Get filtered data with pagination
        const from = (currentPage - 1) * itemsPerPage
        const to = from + itemsPerPage - 1
        
        const { data, error } = await query
          .range(from, to)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching bandi with filters:', error)
          return
        }
        
        console.log('Fetched filtered bandi:', data)
        setBandi(data || [])
        
        // Get total count with filters for pagination
        const { count, error: countError } = await query.count()
        
        if (countError) {
          console.error('Error fetching filtered bandi count:', countError)
        } else {
          setTotalBandi(count || 0)
        }
      } catch (error) {
        console.error('Error with filters:', error)
      } finally {
        setLoadingBandi(false)
      }
    }

    // Fetch unique promoters for filter dropdown
    async function fetchUniquePromotori() {
      try {
        const { data, error } = await supabase
          .from('bandi')
          .select('promotore')
          .order('promotore')
        
        if (error) {
          console.error('Error fetching promotori:', error)
          return
        }
        
        // Extract unique promotori
        const unique = [...new Set(data.map(item => item.promotore))].filter(Boolean)
        setUniquePromotori(unique)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (activeItem === 'tutti-bandi') {
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
          <div className={styles.statsValue}>42</div>
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
          <div className={styles.statsValue}>3</div>
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
            <div className={styles.statsValue}>128</div>
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
            <div className={styles.statsValue}>16</div>
            <div className={styles.statsInfo}>
              <span className={styles.statsDown}>-8%</span> rispetto al mese scorso
            </div>
          </div>
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
                  {/* In a real app, this would be a chart component */}
                  <div className={styles.mockChart}>
                    <div className={styles.mockBar} style={{ height: '65%' }}></div>
                    <div className={styles.mockBar} style={{ height: '40%' }}></div>
                    <div className={styles.mockBar} style={{ height: '80%' }}></div>
                    <div className={styles.mockBar} style={{ height: '55%' }}></div>
                    <div className={styles.mockBar} style={{ height: '75%' }}></div>
                    <div className={styles.mockBar} style={{ height: '50%' }}></div>
                  </div>
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
                  {/* In a real app, this would be a pie chart component */}
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
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Customer Recent Activity Section - Always visible */}
        <div className={`${styles.recentActivitySection} ${styles.compactSection}`}>
          <h2 className={styles.sectionTitle}>Attività Recenti</h2>
          
          {/* Activity list - More compact */}
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
        </div>
      </div>
    </>
  )
} 