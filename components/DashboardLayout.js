import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/Dashboard.module.css'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check for authentication when component mounts
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const storedUserRole = localStorage.getItem('userRole')
    const storedUserName = localStorage.getItem('userName')
    const storedSidebarState = localStorage.getItem('sidebarCollapsed')
    
    if (!isLoggedIn || !storedUserRole) {
      console.log('Not logged in or missing role, redirecting to home')
      router.push('/')
      return
    }
    
    setUserRole(storedUserRole)
    setUserName(storedUserName || 'User')
    setSidebarCollapsed(storedSidebarState === 'true')
    setIsLoading(false)
    
    // Set active item based on current path - improved logic for nested routes
    const path = router.pathname
    console.log('Current pathname:', path)
    
    if (path === '/home') {
      setActiveItem('dashboard')
    } else if (path === '/tutti-bandi') {
      setActiveItem('tutti-bandi')
    } else if (path === '/bandi') {
      setActiveItem('bandi')
    } else if (path === '/applications') {
      setActiveItem('applications')
    } else if (path === '/guides') {
      setActiveItem('guides')
    } else if (path === '/support') {
      setActiveItem('support')
    } else if (path === '/admin/users') {
      setActiveItem('users')
    } else if (path === '/admin/manage-bandi') {
      setActiveItem('manage-bandi')
    } else if (path === '/admin/add-bando') {
      console.log('Setting active item to add-bando')
      setActiveItem('add-bando')
    } else if (path === '/admin/approvals') {
      setActiveItem('approvals')
    } else if (path === '/admin/live-monitor') {
      setActiveItem('live-monitor')
    } else if (path === '/admin/test-layout') {
      console.log('Test layout page detected, keeping current active item:', activeItem)
    } else {
      console.log('No matching route found for:', path)
    }
  }, [router.pathname])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    router.push('/')
  }

  const toggleSidebar = (e) => {
    // Prevent event propagation to avoid unwanted navigation
    if (e) e.stopPropagation();
    
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState.toString());
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <Image src="/logo.svg" alt="BandoEasy Logo" width={32} height={32} />
          {!sidebarCollapsed && <span className={styles.logoText}>Bando Easy</span>}
        </div>

        <nav className={styles.navMenu}>
          {/* Main Navigation */}
          <div className={styles.navSection}>
            {!sidebarCollapsed && <div className={styles.sectionTitle}>Principale</div>}
            
            <div 
              className={`${styles.navItem} ${activeItem === 'dashboard' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('dashboard')
                router.push('/home')
              }}
              data-tooltip="Dashboard"
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              {!sidebarCollapsed && "Dashboard"}
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'bandi' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('bandi')
                router.push('/bandi')
              }}
              data-tooltip="Bandi Disponibili"
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
              {!sidebarCollapsed && "Bandi Disponibili"}
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'tutti-bandi' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('tutti-bandi')
                router.push('/tutti-bandi')
              }}
              data-tooltip="Tutti i Bandi"
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              {!sidebarCollapsed && "Tutti i Bandi"}
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'applications' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('applications')
                router.push('/applications')
              }}
              data-tooltip="Le Mie Domande"
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              {!sidebarCollapsed && "Le Mie Domande"}
            </div>
          </div>

          {/* Admin Section - Will be conditionally rendered based on role */}
          {userRole === 'admin' && (
            <div className={styles.navSection}>
              {!sidebarCollapsed && <div className={styles.sectionTitle}>Amministrazione</div>}
              
              <div 
                className={`${styles.navItem} ${activeItem === 'users' ? styles.navItemActive : ''}`}
                onClick={() => {
                  console.log('Clicking on users admin menu item')
                  setActiveItem('users')
                  router.push('/admin/users')
                }}
                data-tooltip="Gestione Utenti"
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                {!sidebarCollapsed && "Gestione Utenti"}
              </div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'manage-bandi' ? styles.navItemActive : ''}`}
                onClick={() => {
                  console.log('Clicking on manage-bandi admin menu item')
                  setActiveItem('manage-bandi')
                  router.push('/admin/manage-bandi')
                }}
                data-tooltip="Gestione Bandi"
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                {!sidebarCollapsed && "Gestione Bandi"}
              </div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'add-bando' ? styles.navItemActive : ''}`}
                onClick={() => {
                  console.log('Clicking on add-bando admin menu item')
                  setActiveItem('add-bando')
                  router.push('/admin/add-bando')
                }}
                data-tooltip="Aggiungi Bando"
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                {!sidebarCollapsed && "Aggiungi Bando"}
              </div>
              
              <div 
                className={`${styles.navItem} ${activeItem === 'approvals' ? styles.navItemActive : ''}`}
                onClick={() => {
                  console.log('Clicking on approvals admin menu item')
                  setActiveItem('approvals')
                  router.push('/admin/approvals')
                }}
                data-tooltip="Approvazioni"
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                {!sidebarCollapsed && "Approvazioni"}
              </div>
              
              {/* Live Update Monitor */}
              <div 
                className={`${styles.navItem} ${activeItem === 'live-monitor' ? styles.navItemActive : ''}`}
                onClick={() => {
                  console.log('Clicking on live-monitor admin menu item')
                  setActiveItem('live-monitor')
                  router.push('/admin/live-monitor')
                }}
                data-tooltip="Live Monitor"
              >
                <div className={styles.navIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                {!sidebarCollapsed && "Live Monitor"}
              </div>
            </div>
          )}

          {/* Support and Help section - visible to all users */}
          <div className={styles.navSection}>
            {!sidebarCollapsed && <div className={styles.sectionTitle}>Supporto</div>}
            
            <div 
              className={`${styles.navItem} ${activeItem === 'guides' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('guides')
                router.push('/guides')
              }}
              data-tooltip="Guide e FAQ"
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              {!sidebarCollapsed && "Guide e FAQ"}
            </div>
            
            <div 
              className={`${styles.navItem} ${activeItem === 'support' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveItem('support')
                router.push('/support')
              }}
              data-tooltip="Supporto"
            >
              <div className={styles.navIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              {!sidebarCollapsed && "Supporto"}
            </div>
          </div>
        </nav>
      </aside>

      {/* Toggle Button - Moved outside of the sidebar */}
      <button 
        className={styles.toggleSidebarButton} 
        onClick={toggleSidebar} 
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarCollapsed ? (
            // Right arrow when collapsed (to expand)
            <path d="M9 18l6-6-6-6" />
          ) : (
            // Left arrow when expanded (to collapse)
            <path d="M15 18l-6-6 6-6" />
          )}
        </svg>
      </button>

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
          {children}
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© BandoEasy 2025 - Piattaforma italiana per bandi di finanziamento</p>
        </footer>
      </div>
    </div>
  )
} 