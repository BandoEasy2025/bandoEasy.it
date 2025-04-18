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
          {/* Tab Navigation - optimized layout */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'dati-generali' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('dati-generali')}
            >
              Dati generali
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'dettagli' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('dettagli')}
            >
              Dettagli
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'localita' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('localita')}
            >
              Località
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'target' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('target')}
            >
              Target
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'specifiche' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('specifiche')}
            >
              Specifiche
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'spese-ammissibili' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('spese-ammissibili')}
            >
              Spese
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'documentazione' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('documentazione')}
            >
              Documentazione
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'codice-ateco' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('codice-ateco')}
            >
              Ateco
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Dati Generali Tab */}
            {activeTab === 'dati-generali' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Informazioni Principali</h2>
                  <div className={styles.infoTable}>
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>Nome del Bando:</div>
                      <div className={styles.infoValue}>{bandoDetails.nome_bando || 'Non specificato'}</div>
                    </div>
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>Promotore:</div>
                      <div className={styles.infoValue}>{bandoDetails.promotore || 'Non specificato'}</div>
                    </div>
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>Tipo di Bando:</div>
                      <div className={styles.infoValue}>{bandoDetails.tipo_bando || bandoDetails.tipologia_finanziamento || 'Non specificato'}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Timeline</h2>
                  <div className={styles.timeline}>
                    {bandoDetails.created_at && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelinePoint}></div>
                        <div className={styles.timelineContent}>
                          <h3>Pubblicazione</h3>
                          <p>{new Date(bandoDetails.created_at).toLocaleDateString('it-IT')}</p>
                        </div>
                      </div>
                    )}
                    {bandoDetails.scadenza && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelinePoint}></div>
                        <div className={styles.timelineContent}>
                          <h3>Scadenza</h3>
                          <p>{new Date(bandoDetails.scadenza).toLocaleDateString('it-IT')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {bandoDetails.descrizione && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Descrizione</h2>
                    <div className={styles.description}>
                      <p>{bandoDetails.descrizione}</p>
                    </div>
                  </div>
                )}

                {bandoDetails.budget && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Budget</h2>
                    <div className={styles.budgetDisplay}>
                      <span className={styles.budgetAmount}>€{bandoDetails.budget.toLocaleString('it-IT')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Località Tab */}
            {activeTab === 'localita' && (
              <div className={styles.tabContent}>
                <div className={styles.locationCard}>
                  <h2 className={styles.sectionTitle}>Area Geografica</h2>
                  
                  <div className={styles.locationGrid}>
                    <div className={styles.locationItem}>
                      <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Regione
                      </h3>
                      <p>{bandoDetails.regione || bandoDetails.regioni || 'Tutte le regioni italiane'}</p>
                    </div>
                    
                    {bandoDetails.provincia && (
                      <div className={styles.locationItem}>
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
                            <line x1="12" y1="4" x2="12" y2="16" />
                          </svg>
                          Provincia
                        </h3>
                        <p>{bandoDetails.provincia}</p>
                      </div>
                    )}
                    
                    {bandoDetails.comune && (
                      <div className={styles.locationItem}>
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          Comune
                        </h3>
                        <p>{bandoDetails.comune}</p>
                      </div>
                    )}
                  </div>
                  
                  {bandoDetails.area_geografica && (
                    <div className={styles.areaSection}>
                      <h3 className={styles.subsectionTitle}>Dettagli area geografica</h3>
                      <p>{bandoDetails.area_geografica}</p>
                    </div>
                  )}
                </div>
                
                <div className={styles.mapPlaceholder}>
                  <div className={styles.mapNote}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p>Questo bando è applicabile nelle aree geografiche sopra indicate.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifiche Tab */}
            {activeTab === 'specifiche' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Specifiche Tecniche</h2>
                  
                  <div className={styles.specIntro}>
                    <div className={styles.specIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <p className={styles.specText}>{bandoDetails.specifiche || 'Nessuna specifica tecnica disponibile'}</p>
                  </div>
                  
                  {bandoDetails.settore && (
                    <div className={styles.dataCard}>
                      <div className={styles.dataCardHeader}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                        <h3>Settore</h3>
                      </div>
                      <div className={styles.dataCardContent}>
                        <p>{bandoDetails.settore}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {bandoDetails.obiettivi && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Obiettivi</h2>
                    <div className={styles.objectivesList}>
                      {bandoDetails.obiettivi.split('.').filter(obj => obj.trim()).map((objective, index) => (
                        <div key={index} className={styles.objectiveItem}>
                          <div className={styles.objectiveMarker}>{index + 1}</div>
                          <p>{objective.trim()}.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Target Tab */}
            {activeTab === 'target' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Destinatari del Bando</h2>
                  
                  <div className={styles.beneficiariesCard}>
                    <div className={styles.beneficiariesHeader}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <h3>Beneficiari</h3>
                    </div>
                    
                    <div className={styles.beneficiariesContent}>
                      <p>{bandoDetails.beneficiari || 'Informazioni sui beneficiari non disponibili'}</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Requisiti di Ammissibilità</h2>
                  
                  <div className={styles.requirementsList}>
                    {(bandoDetails.requisiti ? bandoDetails.requisiti.split(/\n|\./).filter(req => req.trim()) : ['Requisiti non specificati']).map((requirement, index) => (
                      <div key={index} className={styles.requirementItem}>
                        <div className={styles.checkIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        </div>
                        <p>{requirement.trim()}.</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.eligibilityNote}>
                  <div className={styles.noteIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <p>Verifica attentamente che la tua organizzazione soddisfi tutti i requisiti prima di procedere con la domanda.</p>
                </div>
              </div>
            )}

            {/* Codice Ateco Tab */}
            {activeTab === 'codice-ateco' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Codici ATECO Ammissibili</h2>
                  
                  <div className={styles.atecoContainer}>
                    <div className={styles.atecoHeader}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                      <h3>Settori economici</h3>
                    </div>
                    
                    <div className={styles.atecoContent}>
                      {bandoDetails.codici_ateco ? (
                        <div className={styles.atecoList}>
                          {bandoDetails.codici_ateco.split(',').map((code, index) => (
                            <div key={index} className={styles.atecoCode}>
                              <span className={styles.codeNumber}>{code.trim()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.atecoNone}>
                          <p>Nessun codice ATECO specificato. Il bando potrebbe essere aperto a tutti i settori.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.atecoInfo}>
                  <div className={styles.infoIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <p>I codici ATECO identificano le attività economiche ammissibili per questo bando. Verifica che il tuo codice ATECO sia incluso nell'elenco sopra.</p>
                </div>
              </div>
            )}

            {/* Documentazione Tab */}
            {activeTab === 'documentazione' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Documentazione Necessaria</h2>
                  
                  <div className={styles.documentationContainer}>
                    <div className={styles.documentationIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    
                    <div className={styles.documentationContent}>
                      {bandoDetails.documentazione || bandoDetails.documentazione_necessaria ? (
                        <div className={styles.documentList}>
                          {(bandoDetails.documentazione || bandoDetails.documentazione_necessaria).split(/\n|\.|,/).filter(doc => doc.trim()).map((document, index) => (
                            <div key={index} className={styles.documentItem}>
                              <div className={styles.documentBullet}></div>
                              <p>{document.trim()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.noDocumentation}>Informazioni sulla documentazione non disponibili</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {(bandoDetails.url_documento || bandoDetails.link_bando) && (
                  <div className={styles.documentDownload}>
                    <a 
                      href={bandoDetails.url_documento || bandoDetails.link_bando} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.downloadButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Scarica Documento Ufficiale
                    </a>
                    <p className={styles.downloadNote}>Consulta il documento ufficiale per tutte le informazioni dettagliate.</p>
                  </div>
                )}
              </div>
            )}

            {/* Spese Ammissibili Tab */}
            {activeTab === 'spese-ammissibili' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Spese Ammissibili</h2>
                  
                  <div className={styles.expensesContainer}>
                    <div className={styles.expensesIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    
                    {bandoDetails.spese_ammissibili ? (
                      <div className={styles.expensesList}>
                        {bandoDetails.spese_ammissibili.split(/\n|\.|;/).filter(expense => expense.trim()).map((expense, index) => (
                          <div key={index} className={styles.expenseItem}>
                            <div className={styles.expenseCheckmark}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <p>{expense.trim()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.noExpenses}>Informazioni sulle spese ammissibili non disponibili</p>
                    )}
                  </div>
                </div>
                
                <div className={styles.expensesNote}>
                  <div className={styles.noteIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <p>Le spese devono essere sostenute durante il periodo di ammissibilità del bando e devono essere direttamente correlate alle attività del progetto.</p>
                </div>
              </div>
            )}

            {/* Dettagli Tab */}
            {activeTab === 'dettagli' && (
              <div className={styles.tabContent}>
                <div className={styles.detailsOverview}>
                  <div className={styles.statusCard}>
                    <div className={styles.statusLabel}>Stato</div>
                    <div className={`${styles.statusValue} ${
                      bandoDetails.stato?.toLowerCase() === 'aperto' 
                        ? styles.statusOpen 
                        : bandoDetails.stato?.toLowerCase() === 'chiuso' 
                        ? styles.statusClosed 
                        : styles.statusUpcoming
                    }`}>
                      {bandoDetails.stato || 'Non specificato'}
                    </div>
                  </div>
                  
                  <div className={styles.fundingCard}>
                    <h3>Importo Totale</h3>
                    <div className={styles.fundingAmount}>
                      {bandoDetails.budget 
                        ? `€${bandoDetails.budget.toLocaleString('it-IT')}` 
                        : 'Non specificato'}
                    </div>
                  </div>
                  
                  <div className={styles.fundingCard}>
                    <h3>Importo Min/Max</h3>
                    <div className={styles.fundingAmount}>
                      {bandoDetails.importo_min && (bandoDetails.importo_massimo || bandoDetails.importo_max)
                        ? `€${bandoDetails.importo_min.toLocaleString('it-IT')} - €${(bandoDetails.importo_massimo || bandoDetails.importo_max).toLocaleString('it-IT')}`
                        : bandoDetails.importo_min
                        ? `Min: €${bandoDetails.importo_min.toLocaleString('it-IT')}`
                        : (bandoDetails.importo_massimo || bandoDetails.importo_max)
                        ? `Max: €${(bandoDetails.importo_massimo || bandoDetails.importo_max).toLocaleString('it-IT')}`
                        : 'Non specificato'}
                    </div>
                  </div>
                  
                  {bandoDetails.durata && (
                    <div className={styles.durationCard}>
                      <div className={styles.durationIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className={styles.durationContent}>
                        <h3>Durata</h3>
                        <p>{bandoDetails.durata}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.infoGrid}>
                  {bandoDetails.dettagli_aggiuntivi && (
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionTitle}>Dettagli Aggiuntivi</h2>
                      <p>{bandoDetails.dettagli_aggiuntivi}</p>
                    </div>
                  )}
                  
                  {bandoDetails.modalita_presentazione && (
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionTitle}>Modalità di Presentazione</h2>
                      <div className={styles.submissionDetails}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p>{bandoDetails.modalita_presentazione}</p>
                      </div>
                    </div>
                  )}
                  
                  {bandoDetails.contatti && (
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionTitle}>Contatti</h2>
                      <div className={styles.contactInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{bandoDetails.contatti}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {bandoDetails.note && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>Note</h2>
                    <p>{bandoDetails.note}</p>
                  </div>
                )}
                
                <div className={styles.sectionCard}>
                  <h2 className={styles.sectionTitle}>Link</h2>
                  <div className={styles.extraInfo}>
                    <div className={styles.extraInfoItem}>
                      <a 
                        href={bandoDetails.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Visita il sito ufficiale
                      </a>
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