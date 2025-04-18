import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../../styles/BandoDetail.module.css'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function BandoDetail() {
  const router = useRouter()
  const { id } = router.query
  const [bandoDetails, setBandoDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dati-generali')

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/')
      return
    }
    
    // Fetch bando details when ID is available
    if (id) {
      fetchBandoDetails()
    }
  }, [id, router])

  // Fetch details from Supabase
  async function fetchBandoDetails() {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('bandi')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        throw error
      }
      
      setBandoDetails(data)
    } catch (error) {
      console.error('Error fetching bando details:', error)
      setError('Non è stato possibile caricare i dettagli del bando.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle navigation back to the previous page
  const handleGoBack = () => {
    router.back()
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Show loading state
  if (isLoading) {
    return <div className={styles.loading}>Caricamento...</div>
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Errore</h1>
        <p>{error}</p>
        <button onClick={handleGoBack} className={styles.backButton}>
          Torna alla Home
        </button>
      </div>
    )
  }

  // If bando not found
  if (!bandoDetails) {
    return (
      <div className={styles.errorContainer}>
        <h1>Bando non trovato</h1>
        <p>Il bando richiesto non esiste o è stato rimosso.</p>
        <button onClick={handleGoBack} className={styles.backButton}>
          Torna alla Home
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{bandoDetails.nome_bando || 'Dettagli Bando'} | BandoEasy</title>
        <meta name="description" content={`Dettagli del bando: ${bandoDetails.nome_bando || ''}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={handleGoBack} className={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Torna ai Bandi
          </button>
          
          <h1 className={styles.title}>{bandoDetails.nome_bando}</h1>
          
          {bandoDetails.stato && (
            <span className={`${styles.statusBadge} ${
              bandoDetails.stato.toLowerCase() === 'aperto' 
                ? styles.statusAperto 
                : bandoDetails.stato.toLowerCase() === 'chiuso' 
                ? styles.statusChiuso 
                : styles.statusProssimo
            }`}>
              {bandoDetails.stato}
            </span>
          )}
        </div>

        <div className={styles.bandoCard}>
          {/* Tab Navigation */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'dati-generali' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('dati-generali')}
            >
              Dati generali
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'localita' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('localita')}
            >
              Località
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'specifiche' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('specifiche')}
            >
              Specifiche
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'target' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('target')}
            >
              Target
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'codice-ateco' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('codice-ateco')}
            >
              Codice ateco
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'documentazione' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('documentazione')}
            >
              Documentazione necessaria
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'dettagli' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('dettagli')}
            >
              Dettagli
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Dati Generali Tab */}
            {activeTab === 'dati-generali' && (
              <>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h3>Promotore</h3>
                    <p>{bandoDetails.promotore || 'Non specificato'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Data di scadenza</h3>
                    <p>{bandoDetails.scadenza 
                      ? new Date(bandoDetails.scadenza).toLocaleDateString('it-IT') 
                      : 'Non specificata'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Data di pubblicazione</h3>
                    <p>{bandoDetails.created_at 
                      ? new Date(bandoDetails.created_at).toLocaleDateString('it-IT') 
                      : 'Non specificata'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Tipo di Bando</h3>
                    <p>{bandoDetails.tipo_bando || 'Non specificato'}</p>
                  </div>
                </div>

                {bandoDetails.descrizione && (
                  <div className={styles.section}>
                    <h2>Descrizione</h2>
                    <p>{bandoDetails.descrizione}</p>
                  </div>
                )}

                {bandoDetails.budget && (
                  <div className={styles.section}>
                    <h2>Budget</h2>
                    <p>€{bandoDetails.budget.toLocaleString('it-IT')}</p>
                  </div>
                )}
              </>
            )}

            {/* Località Tab */}
            {activeTab === 'localita' && (
              <div className={styles.section}>
                <h2>Regioni</h2>
                <p>{bandoDetails.regioni || 'Tutte le regioni italiane'}</p>
                
                {bandoDetails.area_geografica && (
                  <>
                    <h2>Area Geografica</h2>
                    <p>{bandoDetails.area_geografica}</p>
                  </>
                )}
              </div>
            )}

            {/* Specifiche Tab */}
            {activeTab === 'specifiche' && (
              <div className={styles.section}>
                <h2>Specifiche Tecniche</h2>
                <p>{bandoDetails.specifiche || 'Nessuna specifica tecnica disponibile'}</p>
                
                {bandoDetails.obiettivi && (
                  <>
                    <h2>Obiettivi</h2>
                    <p>{bandoDetails.obiettivi}</p>
                  </>
                )}
              </div>
            )}

            {/* Target Tab */}
            {activeTab === 'target' && (
              <div className={styles.section}>
                <h2>Beneficiari</h2>
                <p>{bandoDetails.beneficiari || 'Informazioni sui beneficiari non disponibili'}</p>
                
                <h2>Requisiti di ammissibilità</h2>
                <p>{bandoDetails.requisiti || 'Requisiti non specificati'}</p>
              </div>
            )}

            {/* Codice Ateco Tab */}
            {activeTab === 'codice-ateco' && (
              <div className={styles.section}>
                <h2>Codici ATECO</h2>
                <p>{bandoDetails.codici_ateco || 'Nessun codice ATECO specificato. Il bando potrebbe essere aperto a tutti i settori.'}</p>
              </div>
            )}

            {/* Documentazione Tab */}
            {activeTab === 'documentazione' && (
              <div className={styles.section}>
                <h2>Documentazione Necessaria</h2>
                <p>{bandoDetails.documentazione || 'Informazioni sulla documentazione non disponibili'}</p>
                
                {bandoDetails.url_documento && (
                  <div className={styles.documentLinkWrapper}>
                    <a 
                      href={bandoDetails.url_documento} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.documentLink}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Scarica Documento Ufficiale
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Dettagli Tab */}
            {activeTab === 'dettagli' && (
              <div className={styles.section}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h3>Stato del Bando</h3>
                    <p>{bandoDetails.stato || 'Non specificato'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Importo Totale</h3>
                    <p>{bandoDetails.budget 
                      ? `€${bandoDetails.budget.toLocaleString('it-IT')}` 
                      : 'Non specificato'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Importo Massimo per Domanda</h3>
                    <p>{bandoDetails.importo_massimo 
                      ? `€${bandoDetails.importo_massimo.toLocaleString('it-IT')}` 
                      : 'Non specificato'}</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <h3>Durata</h3>
                    <p>{bandoDetails.durata || 'Non specificata'}</p>
                  </div>
                </div>
                
                {bandoDetails.dettagli_aggiuntivi && (
                  <div className={styles.detailSection}>
                    <h2>Dettagli Aggiuntivi</h2>
                    <p>{bandoDetails.dettagli_aggiuntivi}</p>
                  </div>
                )}
                
                {bandoDetails.modalita_presentazione && (
                  <div className={styles.detailSection}>
                    <h2>Modalità di Presentazione</h2>
                    <p>{bandoDetails.modalita_presentazione}</p>
                  </div>
                )}
                
                {bandoDetails.contatti && (
                  <div className={styles.detailSection}>
                    <h2>Contatti</h2>
                    <p>{bandoDetails.contatti}</p>
                  </div>
                )}
                
                {bandoDetails.note && (
                  <div className={styles.detailSection}>
                    <h2>Note</h2>
                    <p>{bandoDetails.note}</p>
                  </div>
                )}
                
                <div className={styles.detailSection}>
                  <h2>Informazioni Extra</h2>
                  <div className={styles.infoTable}>
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>Link al sito ufficiale:</div>
                      <div className={styles.infoValue}>
                        {bandoDetails.url_sito_ufficiale ? (
                          <a 
                            href={bandoDetails.url_sito_ufficiale} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.externalLink}
                          >
                            Visita il sito ufficiale
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        ) : (
                          'Non disponibile'
                        )}
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>Ultimo aggiornamento:</div>
                      <div className={styles.infoValue}>
                        {bandoDetails.updated_at 
                          ? new Date(bandoDetails.updated_at).toLocaleDateString('it-IT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {bandoDetails.stato?.toLowerCase() === 'aperto' && (
              <button className={styles.actionButton}>
                Presenta Domanda
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 