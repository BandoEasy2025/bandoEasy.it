import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('dashboard')
  
  // Initialize userRole state
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Check for authentication when component mounts
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const storedUserRole = localStorage.getItem('userRole')
    const storedUserName = localStorage.getItem('userName')
    
    if (!isLoggedIn || !storedUserRole) {
      router.push('/')
      return
    }
    
    setUserRole(storedUserRole)
    setUserName(storedUserName || 'User')
    setIsLoading(false)
  }, [router])
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    router.push('/')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.dashboardContainer}>
      <Head>
        <title>BandoEasy - Dashboard</title>
        <meta name="description" content="BandoEasy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Image src="/logo.svg" alt="BandoEasy Logo" width={32} height={32} />
          <span className={styles.logoText}>Bando Easy</span>
        </div>

        <nav className={styles.navMenu}>
          {/* Main Navigation */}
          <div className={styles.navSection}>
            <div className={styles.sectionTitle}>Principale</div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'dashboard' ? styles.navItemActive : ''}`}
              onClick={() => setActiveItem('dashboard')}
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              Dashboard
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'bandi' ? styles.navItemActive : ''}`}
              onClick={() => setActiveItem('bandi')}
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              Bandi Disponibili
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'applications' ? styles.navItemActive : ''}`}
              onClick={() => setActiveItem('applications')}
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              Le Mie Domande
            </div>
          </div>

          {/* Admin Section - Will be conditionally rendered based on role */}
          {userRole === 'admin' && (
            <div className={styles.navSection}>
              <div className={styles.sectionTitle}>Amministrazione</div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'users' ? styles.navItemActive : ''}`}
                onClick={() => setActiveItem('users')}
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                Gestione Utenti
              </div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'manage-bandi' ? styles.navItemActive : ''}`}
                onClick={() => setActiveItem('manage-bandi')}
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                Gestione Bandi
              </div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'approvals' ? styles.navItemActive : ''}`}
                onClick={() => setActiveItem('approvals')}
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                Approvazioni
              </div>
            </div>
          )}

          {/* Support and Help section - visible to all users */}
          <div className={styles.navSection}>
            <div className={styles.sectionTitle}>Supporto</div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'guides' ? styles.navItemActive : ''}`}
              onClick={() => setActiveItem('guides')}
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              Guide e FAQ
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'support' ? styles.navItemActive : ''}`}
              onClick={() => setActiveItem('support')}
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              Supporto
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Cerca..." 
            />
          </div>

          <div className={styles.userActions}>
            <button className={styles.iconButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {userName.split(' ').map(name => name[0]).join('').substring(0, 2)}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole}>{userRole === 'admin' ? 'Amministratore' : 'Cliente'}</span>
              </div>
            </div>
            
            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>
            {activeItem === 'dashboard' && 'Dashboard'}
            {activeItem === 'bandi' && 'Bandi Disponibili'}
            {activeItem === 'applications' && 'Le Mie Domande'}
            {activeItem === 'users' && 'Gestione Utenti'}
            {activeItem === 'manage-bandi' && 'Gestione Bandi'}
            {activeItem === 'approvals' && 'Approvazioni'}
            {activeItem === 'guides' && 'Guide e FAQ'}
            {activeItem === 'support' && 'Supporto'}
          </h1>

          {activeItem === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className={styles.dashboardGrid}>
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
              
              {/* Admin-only Analytics Section */}
              {userRole === 'admin' && (
                <div className={styles.adminSection}>
                  <h2 className={styles.sectionTitle}>Statistiche Avanzate</h2>
                  
                  <div className={styles.analyticsContainer}>
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
                      <div className={styles.chartPlaceholder}>
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
                      <div className={styles.pieChartPlaceholder}>
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
              
              {/* Customer Recent Activity Section - visible to everyone */}
              <div className={styles.recentActivitySection}>
                <h2 className={styles.sectionTitle}>Attività Recenti</h2>
                
                {/* Activity list */}
                <div className={styles.activityList}>
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
            </>
          )}

          {activeItem !== 'dashboard' && (
            <div className={styles.contentPlaceholder}>
              Contenuto da implementare
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© BandoEasy 2025 - Piattaforma italiana per bandi di finanziamento</p>
        </footer>
      </div>
    </div>
  )
} 