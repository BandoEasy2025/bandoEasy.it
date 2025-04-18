import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        // In a real application, you'd authenticate with a backend here
        setIsLoading(false)
        router.push('/home')
      }, 1000)
    }
  }

  const handleGoogleSignIn = () => {
    // In a real application, you'd implement Google OAuth here
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      router.push('/home')
    }, 1000)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BandoEasy - Accesso al Portale Bandi</title>
        <meta name="description" content="Accesso al portale bandi di BandoEasy - La piattaforma per i bandi di finanziamento italiani" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.loginSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="BandoEasy Logo" width={40} height={40} />
            <span>Bando Easy</span>
          </div>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Bentornata</h1>
          <p className={styles.subtitle}>Accedi per gestire le tue domande di finanziamento</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Inserisci la tua email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
            </div>
            
            <div className={styles.options}>
              <div className={styles.remember}>
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe" 
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Ricordami per 30 giorni</label>
              </div>
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Password dimenticata?
              </Link>
            </div>
            
            <button 
              className={styles.signInButton} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </button>
            
            <button 
              className={styles.googleButton} 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
              Accedi con Google
            </button>
          </form>
          
          <p className={styles.signup}>
            Non hai ancora un account? <Link href="/signup" className={styles.signupLink}>Iscriviti</Link>
          </p>
        </div>
      </div>

      <div className={styles.testimonialSection}>
        <div className={styles.grantInfo}>
          <div className={styles.grantBadge}>Novità</div>
          <h4>Bando PNRR 2023</h4>
          <p>Finanziamenti disponibili per la transizione digitale</p>
          <div className={styles.grantDetails}>
            <div className={styles.grantDetail}>
              <span>Scadenza</span>
              <strong>30 Ottobre 2023</strong>
            </div>
            <div className={styles.grantDetail}>
              <span>Importo</span>
              <strong>Fino a €150.000</strong>
            </div>
          </div>
        </div>

        <div className={styles.testimonialContent}>
          <blockquote className={styles.quote}>
            "Grazie a BandoEasy abbiamo ottenuto un finanziamento di €120.000 dal bando PNRR per la digitalizzazione della nostra azienda."
          </blockquote>
          
          <div className={styles.author}>
            <h3>Marco Bianchi</h3>
            <p>Direttore, Innovazione Italiana Srl</p>
            <p>PMI nel settore manifatturiero</p>
          </div>
          
          <div className={styles.navigation}>
            <button className={styles.navButton} aria-label="Testimonianza precedente">
              <span>←</span>
            </button>
            <button className={styles.navButton} aria-label="Testimonianza successiva">
              <span>→</span>
            </button>
          </div>
        </div>
        
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>750+</span>
            <span className={styles.statLabel}>Bandi disponibili</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>€15M</span>
            <span className={styles.statLabel}>Finanziamenti ottenuti</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Tasso di successo</span>
          </div>
        </div>
        
        <div className={styles.copyright}>
          © BandoEasy 2023 - Piattaforma italiana per bandi di finanziamento
        </div>
      </div>
    </div>
  )
} 