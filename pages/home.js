import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import DashboardOverview from '../components/DashboardOverview'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Dashboard() {
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Check for authentication when component mounts
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const storedUserRole = localStorage.getItem('userRole')
    const storedUserName = localStorage.getItem('userName')
    
    if (!isLoggedIn) {
      console.log('Not logged in, redirecting to home')
      router.push('/')
      return
    }
    
    setUserRole(storedUserRole)
    setUserName(storedUserName || 'User')
    
    // Only show loading for initial render
    setTimeout(() => {
      setLoading(false)
    }, 800);
  }, [router])

  if (loading) {
    return (
      <>
        <Head>
          <title>BandoEasy - Dashboard</title>
          <meta name="description" content="BandoEasy Dashboard" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.loading}>Caricamento dashboard...</div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>BandoEasy - Dashboard</title>
        <meta name="description" content="BandoEasy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.pageTitle}>Dashboard</h1>
      <DashboardOverview />
    </>
  )
} 