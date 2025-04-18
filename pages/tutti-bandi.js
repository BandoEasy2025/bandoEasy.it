import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function TuttiBandi() {
  const router = useRouter()
  const [bandi, setBandi] = useState([])
  const [loadingBandi, setLoadingBandi] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalBandi, setTotalBandi] = useState(0)
  const itemsPerPage = 10
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [promotoreFilter, setPromotoreFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })
  const [uniquePromotori, setUniquePromotori] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  
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

    const hasFilters = hasActiveFilters()
    if (hasFilters) {
      fetchBandiWithFilters()
    } else {
      fetchBandi()
    }
    fetchUniquePromotori()
  }, [currentPage, searchTerm, statusFilter, promotoreFilter, dateRangeFilter, itemsPerPage])
  
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
        <title>BandoEasy - Tutti i Bandi</title>
        <meta name="description" content="Tutti i Bandi disponibili su BandoEasy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.pageTitle}>Tutti i Bandi</h1>

      <div className={`${styles.tuttiSection} ${styles.tuttiSectionCompact}`}>
        {/* Table section moved up - removed the separate title and keeping just the table */}
        <div className={styles.tuttiHeader}>
          <div className={styles.filterButtonContainer}>
            <button 
              className={styles.filterButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFilters();
              }}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filtri</span> 
              {hasActiveFilters() && 
              <span className={styles.filterCount}>
                {Object.values([statusFilter, promotoreFilter, searchTerm, dateRangeFilter.start, dateRangeFilter.end]).filter(Boolean).length}
              </span>}
            </button>
            
            {/* Filter panel - only visible when showFilters is true */}
            {showFilters && (
              <div 
                id="filter-panel"
                className={styles.filterPanel}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.filterPanelHeader}>
                  <h3>Filtri</h3>
                  <button 
                    className={styles.closeFilterButton} 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilters();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className={styles.filterPanelContent}>
                  <div className={styles.filterItem}>
                    <label htmlFor="search" className={styles.filterLabel}>Cerca:</label>
                    <div className={styles.searchFilter}>
                      <input
                        type="text"
                        id="search"
                        className={styles.filterInput}
                        placeholder="Nome o promotore..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className={styles.filterGrid}>
                    <div className={styles.filterItem}>
                      <label htmlFor="status" className={styles.filterLabel}>Stato:</label>
                      <select 
                        id="status" 
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Tutti</option>
                        <option value="Aperto">Aperto</option>
                        <option value="Chiuso">Chiuso</option>
                        <option value="Prossimo">Prossimo</option>
                      </select>
                    </div>
                    
                    <div className={styles.filterItem}>
                      <label htmlFor="promotore" className={styles.filterLabel}>Promotore:</label>
                      <select 
                        id="promotore" 
                        className={styles.filterSelect}
                        value={promotoreFilter}
                        onChange={(e) => setPromotoreFilter(e.target.value)}
                      >
                        <option value="">Tutti</option>
                        {uniquePromotori.map((promotore) => (
                          <option key={promotore} value={promotore}>
                            {promotore}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.filterGrid}>
                    <div className={styles.filterItem}>
                      <label htmlFor="dateStart" className={styles.filterLabel}>Scadenza da:</label>
                      <input
                        type="date"
                        id="dateStart"
                        className={styles.filterInput}
                        value={dateRangeFilter.start}
                        onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
                      />
                    </div>
                    
                    <div className={styles.filterItem}>
                      <label htmlFor="dateEnd" className={styles.filterLabel}>A:</label>
                      <input
                        type="date"
                        id="dateEnd"
                        className={styles.filterInput}
                        value={dateRangeFilter.end}
                        onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.filterActions}>
                    <button 
                      className={styles.applyFilterButton}
                      onClick={() => {
                        toggleFilters();
                      }}
                    >
                      Applica filtri
                    </button>
                    
                    <button 
                      className={styles.resetButton}
                      onClick={() => {
                        resetFilters();
                        toggleFilters();
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 1-9 9c-2.38 0-4.68-.94-6.36-2.64" />
                        <path d="M3 12a9 9 0 0 1 9-9c2.38 0 4.68.94 6.36 2.64" />
                        <polyline points="3 4 3 8 7 8" />
                        <polyline points="21 20 21 16 17 16" />
                      </svg>
                      Resetta filtri
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Applied filters summary */}
          {hasActiveFilters() && (
            <div className={styles.appliedFiltersTags}>
              {searchTerm && (
                <span className={styles.filterTag}>
                  Ricerca: {searchTerm}
                  <button 
                    className={styles.filterTagRemove}
                    onClick={() => setSearchTerm('')}
                  >×</button>
                </span>
              )}
              {statusFilter && (
                <span className={styles.filterTag}>
                  Stato: {statusFilter}
                  <button 
                    className={styles.filterTagRemove}
                    onClick={() => setStatusFilter('')}
                  >×</button>
                </span>
              )}
              {promotoreFilter && (
                <span className={styles.filterTag}>
                  Promotore: {promotoreFilter}
                  <button 
                    className={styles.filterTagRemove}
                    onClick={() => setPromotoreFilter('')}
                  >×</button>
                </span>
              )}
              {dateRangeFilter.start && (
                <span className={styles.filterTag}>
                  Da: {new Date(dateRangeFilter.start).toLocaleDateString('it-IT')}
                  <button 
                    className={styles.filterTagRemove}
                    onClick={() => setDateRangeFilter({...dateRangeFilter, start: ''})}
                  >×</button>
                </span>
              )}
              {dateRangeFilter.end && (
                <span className={styles.filterTag}>
                  A: {new Date(dateRangeFilter.end).toLocaleDateString('it-IT')}
                  <button 
                    className={styles.filterTagRemove}
                    onClick={() => setDateRangeFilter({...dateRangeFilter, end: ''})}
                  >×</button>
                </span>
              )}
              <button 
                className={styles.clearAllFiltersButton}
                onClick={resetFilters}
              >
                Cancella tutti
              </button>
            </div>
          )}
        </div>
        
        {/* Table section */}
        <div className={styles.tableSectionWrapper}>
          {loadingBandi ? (
            <div className={styles.loadingSpinner}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            </div>
          ) : bandi.length === 0 ? (
            <div className={styles.emptyState}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p>Nessun bando disponibile al momento</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.bandiTable}>
                  <thead>
                    <tr>
                      <th>Nome Bando</th>
                      <th>Promotore</th>
                      <th>Scadenza</th>
                      <th>Stato</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bandi.map((bando) => (
                      <tr key={bando.id}>
                        <td className={styles.truncate}>{bando.nome_bando || 'N/A'}</td>
                        <td>{bando.promotore || 'N/A'}</td>
                        <td>
                          {bando.scadenza 
                            ? new Date(bando.scadenza).toLocaleDateString('it-IT') 
                            : 'N/A'}
                        </td>
                        <td>
                          {bando.stato && (
                            <span 
                              className={`${styles.statusBadge} ${
                                bando.stato.toLowerCase() === 'aperto' 
                                  ? styles.statusAperto 
                                  : bando.stato.toLowerCase() === 'chiuso' 
                                  ? styles.statusChiuso 
                                  : styles.statusProssimo
                              }`}
                            >
                              {bando.stato}
                            </span>
                          )}
                        </td>
                        <td>
                          <button 
                            className={styles.detailButton}
                            onClick={() => router.push(`/bando/${bando.id}`)}
                          >
                            Dettagli
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalBandi > 0 && (
                <>
                  <div className={styles.pagination}>
                    <button 
                      className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ''}`} 
                      onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Pagina precedente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, Math.ceil(totalBandi / itemsPerPage)) }, (_, i) => {
                      // Show a window of 5 pages centered on current page
                      const totalPages = Math.ceil(totalBandi / itemsPerPage)
                      let pageNum
                      
                      if (totalPages <= 5) {
                        // If there are 5 or fewer pages, show all
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        // If we're near the start, show first 5 pages
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        // If we're near the end, show last 5 pages
                        pageNum = totalPages - 4 + i
                      } else {
                        // Otherwise, show 2 before current, current, and 2 after
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`${styles.pageButton} ${currentPage === pageNum ? styles.pageButtonActive : ''}`}
                          onClick={() => goToPage(pageNum)}
                          aria-label={`Pagina ${pageNum}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button 
                      className={`${styles.pageButton} ${currentPage === Math.ceil(totalBandi / itemsPerPage) ? styles.pageButtonDisabled : ''}`}
                      onClick={() => currentPage < Math.ceil(totalBandi / itemsPerPage) && goToPage(currentPage + 1)}
                      disabled={currentPage === Math.ceil(totalBandi / itemsPerPage)}
                      aria-label="Pagina successiva"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className={styles.paginationSummary}>
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalBandi)} di {totalBandi} risultati
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
} 