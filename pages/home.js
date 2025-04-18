import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, we'd clear authentication tokens, etc.
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BandoEasy - Dashboard</title>
        <meta name="description" content="BandoEasy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.svg" alt="BandoEasy Logo" width={32} height={32} />
          <span>Bando Easy</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.profileButton}>
            <span>User Profile</span>
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to BandoEasy</h1>
          <p className={styles.subtitle}>Your dashboard is ready</p>
        </div>

        <div className={styles.cardsSection}>
          <div className={styles.card}>
            <h2>Quick Start</h2>
            <p>Get started with BandoEasy by exploring the features below.</p>
          </div>
          <div className={styles.card}>
            <h2>Recent Activity</h2>
            <p>Your recent activity will be shown here.</p>
          </div>
          <div className={styles.card}>
            <h2>Notifications</h2>
            <p>You have no new notifications.</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2023 BandoEasy. All rights reserved.</p>
      </footer>
    </div>
  )
} 