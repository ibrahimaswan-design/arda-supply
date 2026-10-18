'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import PasswordGate from './PasswordGate'

function useWindowSize() {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    setWidth(window.innerWidth)
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return { isMobile: width < 768 }
}

export default function ClientLayout({ children }) {
  const { isMobile } = useWindowSize()
  return (
    <PasswordGate>
      <Sidebar isMobile={isMobile} />
      <main style={{
        marginLeft: isMobile ? 0 : '240px',
        minHeight: '100vh',
        padding: isMobile ? '20px 16px' : '40px 48px',
        paddingTop: isMobile ? '64px' : '40px',
        backgroundColor: '#F8F4EE',
      }}>
        {children}
      </main>
    </PasswordGate>
  )
}