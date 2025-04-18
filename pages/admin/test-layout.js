import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function TestLayout() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole')
    if (userRole === 'admin') {
      setIsAdmin(true)
    } else {
      router.push('/home')
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Test Admin Layout | BandoEasy</title>
      </Head>

      <div>
        <h1>Test Admin Layout Page</h1>
        <p>This page is for testing if the dashboard layout is correctly applied to admin pages.</p>
        {isAdmin ? (
          <div>
            <p>You are logged in as an admin.</p>
          </div>
        ) : (
          <p>Loading admin check...</p>
        )}
      </div>
    </>
  )
} 