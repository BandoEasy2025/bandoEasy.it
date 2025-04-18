import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyType: '',
    agreeToTerms: false
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
    
    if (!formData.name) {
      newErrors.name = 'Nome completo richiesto'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email richiesta'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password richiesta'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La password deve essere almeno di 6 caratteri'
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Nome azienda richiesto'
    }
    
    if (!formData.companyType) {
      newErrors.companyType = 'Tipo azienda richiesto'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Devi accettare i termini e le condizioni'
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
        setIsLoading(false)
        router.push('/home')
      }, 1000)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BandoEasy - Registrazione</title>
        <meta name="description" content="Registrati a BandoEasy - Trova e richiedi bandi di finanziamento per la tua azienda" />
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
          <h1 className={styles.title}>Crea un account</h1>
          <p className={styles.subtitle}>Registrati per accedere ai bandi di finanziamento</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Inserisci il tuo nome"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>
            
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
                placeholder="Crea una password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="companyName">Nome Azienda</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                placeholder="Inserisci il nome della tua azienda"
                className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                value={formData.companyName}
                onChange={handleChange}
              />
              {errors.companyName && <p className={styles.errorMessage}>{errors.companyName}</p>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="companyType">Tipo di Azienda</label>
              <select
                id="companyType"
                name="companyType"
                className={`${styles.input} ${errors.companyType ? styles.inputError : ''}`}
                value={formData.companyType}
                onChange={handleChange}
              >
                <option value="">Seleziona tipo di azienda</option>
                <option value="startup">Startup</option>
                <option value="pmi">PMI</option>
                <option value="grande">Grande Impresa</option>
                <option value="nonprofit">Non Profit</option>
                <option value="ente">Ente Pubblico</option>
              </select>
              {errors.companyType && <p className={styles.errorMessage}>{errors.companyType}</p>}
            </div>
            
            <div className={styles.options}>
              <div className={styles.remember}>
                <input 
                  type="checkbox" 
                  id="agreeToTerms" 
                  name="agreeToTerms" 
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreeToTerms">Accetto Termini e Condizioni e l'Informativa sulla Privacy</label>
              </div>
            </div>
            {errors.agreeToTerms && <p className={styles.errorMessage}>{errors.agreeToTerms}</p>}
            
            <button 
              className={styles.signInButton} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creazione account...' : 'Crea account'}
            </button>
          </form>
          
          <p className={styles.signup}>
            Hai già un account? <Link href="/" className={styles.signupLink}>Accedi</Link>
          </p>
        </div>
      </div>

      <div className={styles.testimonialSection}>
        <div className={styles.grantInfo}>
          <div className={styles.grantBadge}>Opportunità</div>
          <h4>Scopri i Bandi Disponibili</h4>
          <p>Accedi alle opportunità di finanziamento pubblico per la tua azienda</p>
          <div className={styles.grantDetails}>
            <div className={styles.grantDetail}>
              <span>Ultime Aggiunte</span>
              <strong>12 nuovi bandi</strong>
            </div>
            <div className={styles.grantDetail}>
              <span>Totale Disponibile</span>
              <strong>€500M+</strong>
            </div>
          </div>
        </div>

        <div className={styles.testimonialContent}>
          <blockquote className={styles.quote}>
            "Con BandoEasy abbiamo trovato e ottenuto 3 finanziamenti in 6 mesi, accelerando la crescita della nostra startup."
          </blockquote>
          
          <div className={styles.author}>
            <h3>Giulia Rossi</h3>
            <p>CEO, TechFuturo</p>
            <p>Startup innovativa</p>
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
            <span className={styles.statNumber}>5K+</span>
            <span className={styles.statLabel}>Aziende registrate</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>€45M</span>
            <span className={styles.statLabel}>Finanziamenti erogati</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>230+</span>
            <span className={styles.statLabel}>Comuni supportati</span>
          </div>
        </div>
        
        <div className={styles.copyright}>
          © BandoEasy 2023 - Piattaforma italiana per bandi di finanziamento
        </div>
      </div>
    </div>
  )
} 