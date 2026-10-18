'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

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

const navItems = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/production', label: 'Production', icon: '⊞' },
  { href: '/settings', label: 'Settings', icon: '◇' },
]

const ALERTS = [
  { sku: 'AR-002', name: 'Glow Oil',  status: 'OUT', units: 0,  threshold: 30 },
  { sku: 'AR-004', name: 'Hand Wash', status: 'LOW', units: 43, threshold: 50 },
  { sku: 'AR-005', name: 'Lip Balm',  status: 'LOW', units: 28, threshold: 35 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isMobile } = useWindowSize()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  // Close bell on outside click
  useEffect(() => {
    function handler(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
    }
    if (bellOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [bellOpen])

  return (
    <>
      {/* Hamburger button — mobile only, hidden when sidebar is open */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '44px', height: '44px',
            backgroundColor: '#443A35', color: '#F8F4EE',
            border: 'none', cursor: 'pointer',
            fontSize: '20px', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, borderRadius: '0 0 8px 0',
          }}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      {/* Overlay — mobile only, behind open sidebar */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 150,
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0,
        left: isMobile ? (sidebarOpen ? 0 : -240) : 0,
        width: '240px', height: '100vh',
        backgroundColor: '#443A35',
        display: 'flex', flexDirection: 'column',
        zIndex: 200, overflowY: 'auto',
        transition: isMobile ? 'left 0.25s ease' : 'none',
      }}>

        {/* Brand + bell + close */}
        <div style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid rgba(197,180,157,0.2)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '600',
              color: '#F8F4EE', lineHeight: 1.2, marginBottom: '4px',
            }}>ARDA Supply</div>
            <div style={{
              fontSize: '11px', color: '#C5B49D', fontFamily: 'var(--font-body)',
              fontWeight: '300', letterSpacing: '0.02em',
            }}>powered by KMT AI</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {/* Bell */}
            <div ref={bellRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setBellOpen(v => !v)}
                title="Stock alerts"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(248,244,238,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span style={{
                  position: 'absolute', top: '-1px', right: '-1px',
                  backgroundColor: '#dc3545', color: '#fff',
                  borderRadius: '99px', fontSize: '9px', fontWeight: '700',
                  fontFamily: 'var(--font-body)', lineHeight: 1,
                  padding: '2px 4px', minWidth: '14px', textAlign: 'center',
                }}>{ALERTS.length}</span>
              </button>

              {/* Bell dropdown */}
              {bellOpen && (
                <div style={isMobile ? {
                  position: 'fixed', top: '72px', left: '8px', right: '8px',
                  backgroundColor: '#fff', border: '1px solid #E4DDCC',
                  borderRadius: '6px', boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                  zIndex: 300, overflow: 'hidden',
                } : {
                  position: 'fixed', top: '48px', left: '244px',
                  width: '272px', backgroundColor: '#fff',
                  border: '1px solid #E4DDCC', borderRadius: '6px',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                  zIndex: 300, overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 14px', borderBottom: '1px solid #E4DDCC',
                    fontSize: '11px', fontWeight: '600', color: '#C5B49D',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    fontFamily: 'var(--font-body)',
                  }}>Stock Alerts</div>
                  {ALERTS.map(a => (
                    <div key={a.sku} style={{
                      padding: '10px 14px', borderBottom: '1px solid #F8F4EE',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 7px',
                        borderRadius: '3px', fontSize: '10px', fontWeight: '700',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)',
                        backgroundColor: a.status === 'OUT' ? '#f8d7da' : '#fff3cd',
                        color: a.status === 'OUT' ? '#721c24' : '#856404',
                      }}>{a.status}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#252525', fontFamily: 'var(--font-body)' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#C5B49D', marginTop: '1px', fontFamily: 'var(--font-body)' }}>
                          {a.units} units · threshold {a.threshold}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 14px' }}>
                    <Link
                      href="/production"
                      onClick={() => { setBellOpen(false); setSidebarOpen(false) }}
                      style={{
                        fontSize: '12px', color: '#443A35', fontFamily: 'var(--font-body)',
                        fontWeight: '500', textDecoration: 'none',
                      }}
                    >View inventory →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Close button — mobile only */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#C5B49D', fontSize: '20px', padding: '4px',
                  lineHeight: 1, display: 'flex', alignItems: 'center',
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {navItems.map(item => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 20px', textDecoration: 'none',
                  color: isActive ? '#F8F4EE' : 'rgba(248,244,238,0.6)',
                  backgroundColor: isActive ? 'rgba(197,180,157,0.18)' : 'transparent',
                  borderLeft: isActive ? '2px solid #C5B49D' : '2px solid transparent',
                  fontFamily: 'var(--font-body)', fontSize: '13.5px',
                  fontWeight: isActive ? '500' : '400',
                  letterSpacing: '0.01em', transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '14px', opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(197,180,157,0.2)',
          fontFamily: 'var(--font-body)', fontSize: '11px',
          color: 'rgba(197,180,157,0.6)', letterSpacing: '0.03em',
        }}>
          ARDA Supply v1.0<br />
          <span style={{ color: 'rgba(197,180,157,0.4)' }}>Mock data mode</span>
        </div>

        {/* Log out */}
        <div style={{ padding: '0 20px 20px' }}>
          <button
            onClick={() => {
              try { sessionStorage.removeItem('arda_auth') } catch (e) {}
              window.location.reload()
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '11px',
              color: '#C5B49D', padding: '0', letterSpacing: '0.02em',
            }}
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
