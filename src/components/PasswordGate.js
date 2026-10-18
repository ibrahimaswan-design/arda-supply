'use client'

import { useState, useEffect } from 'react'

// SHA-256 hash of the access password (the password itself is not stored)
const PASSWORD_HASH = '0051aebec0adf5da39a36471285154c5533d5d41360f7a1a1411cf6f965a0128'
const STORAGE_KEY = 'arda_auth'

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PasswordGate({ children }) {
  const [status, setStatus] = useState('checking') // checking | locked | open
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let ok = false
    try { ok = sessionStorage.getItem(STORAGE_KEY) === PASSWORD_HASH } catch (e) {}
    setStatus(ok ? 'open' : 'locked')
  }, [])

  async function submit(e) {
    e.preventDefault()
    let hash = ''
    try { hash = await sha256(value) } catch (err) {}
    if (hash === PASSWORD_HASH) {
      try { sessionStorage.setItem(STORAGE_KEY, PASSWORD_HASH) } catch (err) {}
      setError('')
      setStatus('open')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (status === 'open') return children
  if (status === 'checking') return <div style={{ minHeight: '100vh', backgroundColor: '#F8F4EE' }} />

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F8F4EE',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <form onSubmit={submit} style={{
        width: '100%', maxWidth: '340px', backgroundColor: '#fff',
        border: '1px solid #E4DDCC', borderRadius: '6px', padding: '32px 28px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.08)', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '600',
          color: '#443A35', lineHeight: 1.2, marginBottom: '4px',
        }}>ARDA Supply</div>
        <div style={{
          fontSize: '11px', color: '#C5B49D', fontFamily: 'var(--font-body)',
          fontWeight: '300', letterSpacing: '0.02em', marginBottom: '24px',
        }}>powered by KMT AI</div>
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 12px',
            border: '1px solid #E4DDCC', borderRadius: '4px',
            fontFamily: 'var(--font-body)', fontSize: '14px', color: '#252525',
            backgroundColor: '#F8F4EE', outline: 'none', marginBottom: '12px',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%', padding: '10px 12px', border: 'none', borderRadius: '4px',
            backgroundColor: '#443A35', color: '#F8F4EE', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: '500',
            letterSpacing: '0.01em',
          }}
        >Enter</button>
        {error && (
          <div style={{
            marginTop: '12px', fontSize: '12px', color: '#721c24',
            fontFamily: 'var(--font-body)',
          }}>{error}</div>
        )}
      </form>
    </div>
  )
}
