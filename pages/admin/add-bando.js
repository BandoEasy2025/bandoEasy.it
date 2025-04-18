import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/AddBando.module.css'
import dashboardStyles from '../../styles/Dashboard.module.css'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AddBando() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  
  // Form state
  const [formData, setFormData] = useState({
    nome_bando: '',
    promotore: '',
    scadenza: '',
    stato: 'Aperto',
    importo_min: '',
    importo_max: '',
    regione: '',
    provincia: '',
    comune: '',
    settore: '',
    tipologia_finanziamento: '',
    requisiti: '',
    spese_ammissibili: '',
    documentazione_necessaria: '',
    descrizione: '',
    link_bando: ''
  })

  // Check admin role
  useEffect(() => {
    console.log('AddBando component mounted')
    const userRole = localStorage.getItem('userRole')
    console.log('User role from localStorage:', userRole)
    
    if (userRole !== 'admin') {
      console.log('Redirecting to home - not admin')
      router.push('/home')
    }
  }, [router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', content: '' })
    
    try {
      // Validate required fields
      if (!formData.nome_bando || !formData.promotore || !formData.scadenza) {
        setMessage({ type: 'error', content: 'I campi Nome bando, Promotore e Scadenza sono obbligatori.' })
        setIsSaving(false)
        return
      }
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('bandi')
        .insert([formData])
        .select()
      
      if (error) {
        throw error
      }
      
      // Show success message
      setMessage({ type: 'success', content: 'Bando aggiunto con successo!' })
      
      // Clear form
      setFormData({
        nome_bando: '',
        promotore: '',
        scadenza: '',
        stato: 'Aperto',
        importo_min: '',
        importo_max: '',
        regione: '',
        provincia: '',
        comune: '',
        settore: '',
        tipologia_finanziamento: '',
        requisiti: '',
        spese_ammissibili: '',
        documentazione_necessaria: '',
        descrizione: '',
        link_bando: ''
      })
    } catch (error) {
      console.error('Error adding bando:', error)
      setMessage({ type: 'error', content: `Errore: ${error.message || 'Si è verificato un errore durante il salvataggio.'}` })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Head>
        <title>Aggiungi Bando | BandoEasy</title>
        <meta name="description" content="Aggiungi un nuovo bando al database" />
      </Head>

      <div className={dashboardStyles.mainContent}>
        <div className={styles.pageHeader}>
          <h1>Aggiungi Nuovo Bando</h1>
        </div>

        {message.content && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.content}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* General Information */}
            <div className={styles.formSection}>
              <h2>Informazioni Generali</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="nome_bando">Nome Bando*</label>
                <input
                  type="text"
                  id="nome_bando"
                  name="nome_bando"
                  value={formData.nome_bando}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="promotore">Promotore*</label>
                <input
                  type="text"
                  id="promotore"
                  name="promotore"
                  value={formData.promotore}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="scadenza">Scadenza*</label>
                <input
                  type="date"
                  id="scadenza"
                  name="scadenza"
                  value={formData.scadenza}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="stato">Stato</label>
                <select
                  id="stato"
                  name="stato"
                  value={formData.stato}
                  onChange={handleChange}
                >
                  <option value="Aperto">Aperto</option>
                  <option value="Chiuso">Chiuso</option>
                  <option value="In arrivo">In arrivo</option>
                </select>
              </div>
            </div>
            
            {/* Importi e Località */}
            <div className={styles.formSection}>
              <h2>Importi e Località</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="importo_min">Importo Minimo (€)</label>
                <input
                  type="number"
                  id="importo_min"
                  name="importo_min"
                  value={formData.importo_min}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="importo_max">Importo Massimo (€)</label>
                <input
                  type="number"
                  id="importo_max"
                  name="importo_max"
                  value={formData.importo_max}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="regione">Regione</label>
                <input
                  type="text"
                  id="regione"
                  name="regione"
                  value={formData.regione}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="provincia">Provincia</label>
                <input
                  type="text"
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Località e Specifiche */}
            <div className={styles.formSection}>
              <h2>Specifiche</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="comune">Comune</label>
                <input
                  type="text"
                  id="comune"
                  name="comune"
                  value={formData.comune}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="settore">Settore</label>
                <input
                  type="text"
                  id="settore"
                  name="settore"
                  value={formData.settore}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="tipologia_finanziamento">Tipologia di Finanziamento</label>
                <input
                  type="text"
                  id="tipologia_finanziamento"
                  name="tipologia_finanziamento"
                  value={formData.tipologia_finanziamento}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="link_bando">Link al Bando</label>
                <input
                  type="url"
                  id="link_bando"
                  name="link_bando"
                  value={formData.link_bando}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            {/* Dettagli 1 */}
            <div className={styles.formSection}>
              <h2>Descrizione e Requisiti</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="descrizione">Descrizione</label>
                <textarea
                  id="descrizione"
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="requisiti">Requisiti</label>
                <textarea
                  id="requisiti"
                  name="requisiti"
                  value={formData.requisiti}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            {/* Dettagli 2 */}
            <div className={styles.formSection}>
              <h2>Altre Informazioni</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="spese_ammissibili">Spese Ammissibili</label>
                <textarea
                  id="spese_ammissibili"
                  name="spese_ammissibili"
                  value={formData.spese_ammissibili}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="documentazione_necessaria">Documentazione Necessaria</label>
                <textarea
                  id="documentazione_necessaria"
                  name="documentazione_necessaria"
                  value={formData.documentazione_necessaria}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSaving}
            >
              {isSaving ? 'Salvataggio...' : 'Salva Bando'}
            </button>
            
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => router.push('/home')}
              disabled={isSaving}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </>
  )
} 