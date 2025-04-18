import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
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
        setIsSubmitted(true)
      }, 1000)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>BandoEasy - Forgot Password</title>
        <meta name="description" content="Reset your BandoEasy password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.loginSection} style={{ width: '100%' }}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="BandoEasy Logo" width={40} height={40} />
            <span>Bando Easy</span>
          </div>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Forgot Password</h1>
          
          {!isSubmitted ? (
            <>
              <p className={styles.subtitle}>Enter your email and we'll send you a reset link</p>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter your email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                </div>
                
                <button 
                  className={styles.signInButton} 
                  type="submit"
                  disabled={isLoading}
                  style={{ marginTop: '20px' }}
                >
                  {isLoading ? 'Sending reset link...' : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successMessage}>
              <p>Reset link sent! Please check your email.</p>
              <p className={styles.emailSent}>{email}</p>
            </div>
          )}
          
          <p className={styles.signup}>
            <Link href="/" className={styles.signupLink}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 