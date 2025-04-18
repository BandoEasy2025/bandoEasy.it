import '../styles/globals.css'
import DashboardLayout from '../components/DashboardLayout'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

function MyApp({ Component, pageProps, router }) {
  // Pages that should not use dashboard layout
  const noLayoutPages = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/signup']
  
  // Check if current path should use layout
  const shouldUseLayout = !noLayoutPages.includes(router.pathname)
  
  return (
    <AnimatePresence mode="wait">
      {shouldUseLayout ? (
        <DashboardLayout key={router.route}>
          <PageTransition>
            <Component {...pageProps} />
          </PageTransition>
        </DashboardLayout>
      ) : (
        <PageTransition key={router.route}>
          <Component {...pageProps} />
        </PageTransition>
      )}
    </AnimatePresence>
  )
}

export default MyApp 