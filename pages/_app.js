import '../styles/globals.css'
import DashboardLayout from '../components/DashboardLayout'

function MyApp({ Component, pageProps, router }) {
  // Pages that should not use dashboard layout
  const noLayoutPages = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  
  // Check if current path should use layout
  const shouldUseLayout = !noLayoutPages.includes(router.pathname)
  
  // If on a dashboard page, wrap with layout, otherwise render normally
  return shouldUseLayout ? (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  ) : (
    <Component {...pageProps} />
  )
}

export default MyApp 