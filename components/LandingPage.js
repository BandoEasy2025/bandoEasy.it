import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/LandingPage.module.css';
import Particles from './Particles';

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all animated sections
    const elementsToObserve = [
      statsRef.current,
      featuresRef.current,
      benefitsRef.current,
      testimonialsRef.current,
      pricingRef.current
    ];
    
    elementsToObserve.forEach(element => {
      if (element) observer.observe(element);
    });
    
    // Handle scroll to top button visibility
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      elementsToObserve.forEach(element => {
        if (element) observer.unobserve(element);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll function
  const scrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close menu after clicking
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} hero-section ${isVisible ? styles.visible : ''}`} ref={heroRef}>
        <div className={styles.particlesContainer}>
          <Particles className={styles.particles} key="landingParticles" />
        </div>
        
        <div className={styles.navBar}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="BandoEasy Logo" width={40} height={40} />
            <span>BandoEasy</span>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
            <div className={`${styles.menuBar} ${isMobileMenuOpen ? styles.open : ''}`}></div>
            <div className={`${styles.menuBar} ${isMobileMenuOpen ? styles.open : ''}`}></div>
            <div className={`${styles.menuBar} ${isMobileMenuOpen ? styles.open : ''}`}></div>
          </div>
          
          <div className={`${styles.navItems} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
            <a onClick={() => scrollToSection(featuresRef)} style={{ cursor: 'pointer' }}>Funzionalità</a>
            <a onClick={() => scrollToSection(benefitsRef)} style={{ cursor: 'pointer' }}>Vantaggi</a>
            <a onClick={() => scrollToSection(testimonialsRef)} style={{ cursor: 'pointer' }}>Testimonianze</a>
            <a onClick={() => scrollToSection(pricingRef)} style={{ cursor: 'pointer' }}>Prezzi</a>
          </div>
          <div className={styles.navCta}>
            <button 
              className={styles.loginButton} 
              onClick={() => router.push('/login')}
            >
              Accedi
            </button>
            <button 
              className={styles.signupButton} 
              onClick={() => router.push('/signup')}
            >
              Registrati
            </button>
          </div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={`${styles.gradientText} gradient-text`}>Semplifica</span> la ricerca e gestione dei bandi di finanziamento
            </h1>
            <p className={styles.heroSubtitle}>
              BandoEasy è la piattaforma all-in-one che ti aiuta a trovare, monitorare e gestire i bandi di finanziamento più adatti alla tua azienda.
            </p>
            <div className={styles.heroCta}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/signup')}
              >
                Inizia gratuitamente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button className={styles.secondaryButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Guarda la demo
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.dashboardPreview}>
              <div className={styles.browserMockup}>
                <div className={styles.browserHeader}>
                  <div className={styles.browserControls}>
                    <span className={styles.browserControl}></span>
                    <span className={styles.browserControl}></span>
                    <span className={styles.browserControl}></span>
                  </div>
                  <div className={styles.browserAddress}>bandoeasy.it/dashboard</div>
                </div>
                <div className={styles.browserContent}>
                  <img 
                    src="/dashboard-preview.png" 
                    alt="BandoEasy dashboard" 
                    className={styles.previewImage}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400/2CBE82/white?text=BandoEasy+Dashboard";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className={styles.waveDivider}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#f9f9f9" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>

      {/* Stats Section */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className={styles.statsContainer}>
          <div className={`${styles.statItem} stat-item`}>
            <h3>500+</h3>
            <p>Bandi attivi monitorati</p>
          </div>
          <div className={`${styles.statItem} stat-item`}>
            <h3>€250M+</h3>
            <p>Finanziamenti ottenuti</p>
          </div>
          <div className={`${styles.statItem} stat-item`}>
            <h3>98%</h3>
            <p>Clienti soddisfatti</p>
          </div>
          <div className={`${styles.statItem} stat-item`}>
            <h3>5000+</h3>
            <p>Aziende iscritte</p>
          </div>
        </div>
      </section>

      {/* Diagonal Divider */}
      <div className={styles.diagonalDivider}></div>

      {/* Features Section */}
      <section className={styles.featuresSection} id="features" ref={featuresRef}>
        <div className={styles.sectionHeader}>
          <h2>Funzionalità Principali</h2>
          <p>Tutto ciò di cui hai bisogno per gestire al meglio le opportunità di finanziamento</p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <h3>Ricerca Intelligente</h3>
            <p>Trova rapidamente i bandi più adatti alla tua azienda grazie al nostro motore di ricerca basato su AI.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <h3>Match Personalizzato</h3>
            <p>Ricevi consigli su misura basati sul profilo della tua azienda e sulle tue esigenze specifiche.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
            <h3>Scadenze e Reminder</h3>
            <p>Non perdere mai una scadenza importante grazie al nostro sistema di notifiche e promemoria.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
            </div>
            <h3>Analisi e Report</h3>
            <p>Monitora le tue performance e visualizza statistiche dettagliate sui finanziamenti ottenuti.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>
            <h3>Gestione Documenti</h3>
            <p>Organizza e archivia tutti i documenti necessari per le tue domande di finanziamento.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
            <div className={styles.featureIcon}>
              <div className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <h3>Team Collaborativo</h3>
            <p>Collabora con il tuo team in tempo reale per preparare e inviare le domande di finanziamento.</p>
            <div className={styles.featureArrow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Curved Divider */}
      <div className={styles.curvedDivider}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#f5f8ff" fillOpacity="1" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,100L1320,100C1200,100,960,100,720,100C480,100,240,100,120,100L0,100Z"></path>
        </svg>
      </div>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection} id="benefits" ref={benefitsRef}>
        <div className={styles.sectionHeader}>
          <h2>Come Funziona</h2>
          <p>Tre semplici passaggi per iniziare a utilizzare BandoEasy</p>
        </div>
        
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Crea il tuo profilo</h3>
            <p>Inserisci le informazioni sulla tua azienda e specifica i tuoi interessi per ricevere consigli personalizzati.</p>
          </div>
          
          <div className={`${styles.stepConnector} ${styles.stepConnectorRight}`}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Esplora i bandi</h3>
            <p>Naviga tra centinaia di opportunità di finanziamento filtrate in base al tuo profilo aziendale.</p>
          </div>
          
          <div className={`${styles.stepConnector} ${styles.stepConnectorLeft}`}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Gestisci le tue domande</h3>
            <p>Prepara, invia e monitora le tue domande di finanziamento attraverso la nostra piattaforma intuitiva.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Background Pattern */}
      <section className={`${styles.testimonialsSection} ${styles.patternedBackground}`} id="testimonials" ref={testimonialsRef}>
        <div className={styles.sectionHeader}>
          <h2>Cosa Dicono i Nostri Clienti</h2>
          <p>Scopri le storie di successo delle aziende che utilizzano BandoEasy</p>
        </div>
        
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L4 19V11M20 11L14 19V11" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>BandoEasy ha trasformato il modo in cui gestiamo i bandi di finanziamento. Prima era un processo caotico, ora è tutto organizzato e automatizzato. Abbiamo aumentato del 60% i finanziamenti ottenuti nell'ultimo anno.</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cliente" className={styles.testimonialAvatar} />
              <div>
                <h4>Marco Bianchi</h4>
                <p>CEO, TechInnovate Srl</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L4 19V11M20 11L14 19V11" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>La funzione di match personalizzato ci ha permesso di scoprire opportunità di finanziamento che non avremmo mai trovato da soli. Il ROI è stato straordinario: con un solo bando vinto abbiamo coperto i costi della piattaforma per i prossimi 5 anni.</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cliente" className={styles.testimonialAvatar} />
              <div>
                <h4>Laura Rossi</h4>
                <p>CFO, GreenFarm Agricoltura</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L4 19V11M20 11L14 19V11" stroke="#2CBE82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Come startup, non avevamo le risorse per monitorare costantemente i bandi. BandoEasy non solo ci ha fatto risparmiare tempo, ma ci ha anche guidato attraverso l'intero processo di application, aumentando significativamente le nostre possibilità di successo.</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Cliente" className={styles.testimonialAvatar} />
              <div>
                <h4>Giovanni Verdi</h4>
                <p>Founder, NexTourism</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing" ref={pricingRef}>
        <div className={styles.sectionHeader}>
          <h2>Piani e Prezzi</h2>
          <p>Scegli il piano più adatto alle esigenze della tua azienda</p>
        </div>
        
        <div className={styles.pricingContainer}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <div className={styles.pricingBadge}>Base</div>
              <h3>Starter</h3>
              <div className={styles.price}>
                <span className={styles.currency}>€</span>
                <span className={styles.amount}>99</span>
                <span className={styles.period}>/mese</span>
              </div>
              <p>Ideale per piccole imprese e startup</p>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>Accesso a 100+ bandi attivi</li>
              <li>Notifiche su nuovi bandi</li>
              <li>Cruscotto personalizzato</li>
              <li>1 utente</li>
              <li className={styles.disabledFeature}>Analisi avanzate</li>
              <li className={styles.disabledFeature}>Supporto prioritario</li>
            </ul>
            <button className={styles.pricingButton}>Inizia ora</button>
          </div>
          
          <div className={`${styles.pricingCard} ${styles.popularPlan}`}>
            <div className={styles.popularBadge}>Più popolare</div>
            <div className={styles.pricingHeader}>
              <div className={styles.pricingBadge}>Professionale</div>
              <h3>Business</h3>
              <div className={styles.price}>
                <span className={styles.currency}>€</span>
                <span className={styles.amount}>249</span>
                <span className={styles.period}>/mese</span>
              </div>
              <p>Perfetto per PMI in crescita</p>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>Accesso a tutti i bandi</li>
              <li>Match personalizzato avanzato</li>
              <li>Gestione completa delle domande</li>
              <li>5 utenti</li>
              <li>Analisi e report dettagliati</li>
              <li className={styles.disabledFeature}>Supporto prioritario</li>
            </ul>
            <button className={`${styles.pricingButton} ${styles.primaryPricingButton}`}>Inizia ora</button>
          </div>
          
          <div className={styles.pricingCard}>
            <div className={styles.pricingHeader}>
              <div className={styles.pricingBadge}>Avanzato</div>
              <h3>Enterprise</h3>
              <div className={styles.price}>
                <span className={styles.currency}>€</span>
                <span className={styles.amount}>499</span>
                <span className={styles.period}>/mese</span>
              </div>
              <p>Per grandi aziende con esigenze complesse</p>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>Accesso a tutti i bandi</li>
              <li>Soluzioni personalizzate</li>
              <li>Integrazioni API</li>
              <li>Utenti illimitati</li>
              <li>Dashboard e analisi avanzate</li>
              <li>Supporto prioritario 24/7</li>
            </ul>
            <button className={styles.pricingButton}>Contattaci</button>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className={`${styles.ctaSection} ${styles.gradientBackground}`}>
        <div className={styles.ctaContent}>
          <h2>Pronto a trasformare il modo in cui gestisci i finanziamenti?</h2>
          <p>Inizia oggi stesso a utilizzare BandoEasy e scopri tutte le opportunità che ti stai perdendo.</p>
          <div className={styles.ctaButtons}>
            <button 
              className={styles.primaryCtaButton}
              onClick={() => router.push('/signup')}
            >
              Inizia gratuitamente
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
            <button 
              className={styles.secondaryCtaButton}
              onClick={() => router.push('/contact')}
            >
              Richiedi una demo
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </button>
          </div>
          <div className={styles.ctaTrustBadges}>
            <div className={styles.trustBadge}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Sicurezza garantita</span>
            </div>
            <div className={styles.trustBadge}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Prova gratuita di 14 giorni</span>
            </div>
            <div className={styles.trustBadge}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>100% Made in Italy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${styles.footer} page-footer`}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Image src="/logo.svg" alt="BandoEasy Logo" width={40} height={40} />
            <span>BandoEasy</span>
          </div>
          
          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <h4>Prodotto</h4>
              <ul>
                <li><a onClick={() => scrollToSection(featuresRef)} style={{ cursor: 'pointer' }}>Funzionalità</a></li>
                <li><a onClick={() => scrollToSection(pricingRef)} style={{ cursor: 'pointer' }}>Prezzi</a></li>
                <li><a href="/roadmap">Roadmap</a></li>
                <li><a href="/release-notes">Note di rilascio</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4>Risorse</h4>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/guides">Guide</a></li>
                <li><a href="/webinars">Webinar</a></li>
                <li><a href="/help-center">Centro assistenza</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4>Azienda</h4>
              <ul>
                <li><a href="/about">Chi siamo</a></li>
                <li><a href="/careers">Lavora con noi</a></li>
                <li><a href="/contact">Contatti</a></li>
                <li><a href="/partners">Partner</a></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h4>Legale</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Termini di servizio</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
                <li><a href="/gdpr">GDPR</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} BandoEasy Srl. Tutti i diritti riservati.
          </div>
          <div className={styles.socialLinks}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className={styles.scrollTopButton} onClick={scrollToTop}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
} 