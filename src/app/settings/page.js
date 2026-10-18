'use client'

import { useState, useEffect } from 'react'
import { products as initialProducts, suppliers, overheadEntries as initialOverhead, emailSettings as initialEmail, exchangeRates as initialRates } from '@/data/mockData'

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

const c = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

const btnPrimary = { backgroundColor: '#443A35', color: '#F8F4EE', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '500', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }
const btnSecondary = { backgroundColor: 'transparent', color: '#443A35', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '500', padding: '8px 16px', borderRadius: '4px', border: '1px solid #C5B49D', cursor: 'pointer' }
const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #E4DDCC', borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)', backgroundColor: '#fff', color: '#252525', outline: 'none' }
const fieldLabel = { fontSize: '11px', fontWeight: '600', color: '#C5B49D', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body)' }
const thStyle = { textAlign: 'left', padding: '12px 16px 12px 0', fontSize: '11px', fontWeight: '600', color: '#C5B49D', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', borderBottom: '1px solid #E4DDCC', whiteSpace: 'nowrap' }
const tdStyle = { padding: '12px 16px 12px 0', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#252525', borderBottom: '1px solid #E4DDCC', verticalAlign: 'middle' }

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, margin: '0 0 6px' }}>{title}</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: c.taupe, margin: 0 }}>{subtitle}</p>
    </div>
  )
}

function Backdrop({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.35)', zIndex: 200 }}
    />
  )
}

function SlideInPanel({ open, onClose, title, children, isMobile }) {
  if (!open) return null
  return (
    <>
      <Backdrop onClose={onClose} />
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh',
        width: isMobile ? '100%' : '420px',
        backgroundColor: '#fff', zIndex: 300,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: `1px solid ${c.softDune}`, flexShrink: 0,
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ ...btnSecondary, padding: '6px 12px' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>{children}</div>
      </div>
    </>
  )
}

function CenteredModal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <>
      <Backdrop onClose={onClose} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '420px', maxWidth: 'calc(100vw - 32px)',
        backgroundColor: '#fff', borderRadius: '8px', zIndex: 300,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: '24px',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, margin: '0 0 20px' }}>{title}</h3>
        {children}
      </div>
    </>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', cursor: 'pointer', padding: '14px 0',
      borderBottom: `1px solid ${c.softDune}`,
      fontFamily: 'var(--font-body)', fontSize: '14px', color: c.black,
    }}>
      <span>{label}</span>
      <span style={{ position: 'relative', width: '44px', height: '24px', flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '12px',
          backgroundColor: checked ? c.umber : c.softDune,
          transition: 'background-color 0.2s',
        }} />
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          backgroundColor: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </span>
    </label>
  )
}

const emptyProduct = { id: '', name: '', category: '', reorderThreshold: '', sellingPriceEGP: '' }

function ProductsSection({ isMobile }) {
  const [productList, setProductList] = useState(initialProducts)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addForm, setAddForm] = useState(emptyProduct)
  const [editForm, setEditForm] = useState(emptyProduct)

  const openEdit = (p) => {
    setEditForm({
      id: p.id,
      name: p.name,
      category: p.category,
      reorderThreshold: String(p.reorderThreshold),
      sellingPriceEGP: String(p.sellingPriceEGP),
    })
    setEditOpen(true)
  }

  const saveEdit = () => {
    setProductList(list => list.map(p =>
      p.id === editForm.id
        ? {
            ...p,
            name: editForm.name,
            category: editForm.category,
            reorderThreshold: Number(editForm.reorderThreshold) || 0,
            sellingPriceEGP: Number(editForm.sellingPriceEGP) || 0,
          }
        : p
    ))
    setEditOpen(false)
  }

  const saveAdd = () => {
    setProductList(list => [...list, {
      id: addForm.id,
      name: addForm.name,
      category: addForm.category,
      reorderThreshold: Number(addForm.reorderThreshold) || 0,
      sellingPriceEGP: Number(addForm.sellingPriceEGP) || 0,
    }])
    setAddForm(emptyProduct)
    setAddOpen(false)
  }

  const productFields = (form, setForm, readOnlySku = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={fieldLabel}>SKU</label>
        <input
          style={inputStyle}
          value={form.id}
          readOnly={readOnlySku}
          onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
        />
      </div>
      <div>
        <label style={fieldLabel}>Name</label>
        <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label style={fieldLabel}>Category</label>
        <input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
      </div>
      <div>
        <label style={fieldLabel}>Reorder Threshold</label>
        <input type="number" min="0" style={inputStyle} value={form.reorderThreshold} onChange={e => setForm(f => ({ ...f, reorderThreshold: e.target.value }))} />
      </div>
      <div>
        <label style={fieldLabel}>Selling Price EGP</label>
        <input type="number" min="0" style={inputStyle} value={form.sellingPriceEGP} onChange={e => setForm(f => ({ ...f, sellingPriceEGP: e.target.value }))} />
      </div>
    </div>
  )

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <SectionHeader title="Products" subtitle="Manage your product catalogue" />
        <button style={{ ...btnPrimary, flexShrink: 0 }} onClick={() => setAddOpen(true)}>+ Add Product</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
          <thead>
            <tr>
              {['SKU', 'Name', 'Category', 'Reorder Threshold', 'Selling Price (EGP)', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productList.map(p => (
              <tr key={p.id}>
                <td style={{ ...tdStyle, fontWeight: '600', color: c.umber }}>{p.id}</td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.category}</td>
                <td style={tdStyle}>{p.reorderThreshold.toLocaleString()}</td>
                <td style={tdStyle}>{p.sellingPriceEGP.toLocaleString()}</td>
                <td style={tdStyle}>
                  <button style={{ ...btnSecondary, padding: '5px 12px', fontSize: '11px' }} onClick={() => openEdit(p)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideInPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add Product" isMobile={isMobile}>
        {productFields(addForm, setAddForm)}
        <button style={{ ...btnPrimary, width: '100%', marginTop: '20px' }} onClick={saveAdd}>Save</button>
      </SlideInPanel>

      <CenteredModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Product">
        {productFields(editForm, setEditForm, true)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button style={{ ...btnPrimary, flex: 1 }} onClick={saveEdit}>Save</button>
          <button style={{ ...btnSecondary, flex: 1 }} onClick={() => setEditOpen(false)}>Cancel</button>
        </div>
      </CenteredModal>
    </section>
  )
}

function OverheadSection() {
  const [items, setItems] = useState(initialOverhead)
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ label: '', amountEGP: '' })

  const total = items.reduce((sum, o) => sum + o.amountEGP, 0)

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditAmount(String(item.amountEGP))
  }

  const saveEdit = (id) => {
    setItems(list => list.map(o =>
      o.id === id ? { ...o, amountEGP: Number(editAmount) || 0 } : o
    ))
    setEditingId(null)
  }

  const saveNew = () => {
    if (!newItem.label.trim()) return
    setItems(list => [...list, {
      id: `OH-${String(list.length + 1).padStart(3, '0')}`,
      label: newItem.label,
      amountEGP: Number(newItem.amountEGP) || 0,
    }])
    setNewItem({ label: '', amountEGP: '' })
    setAdding(false)
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <SectionHeader title="Monthly Overhead" subtitle="These costs are allocated across products to calculate fully-loaded margin" />
        <button style={{ ...btnPrimary, flexShrink: 0 }} onClick={() => setAdding(true)}>+ Add Item</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
          <thead>
            <tr>
              {['Item', 'Amount (EGP)', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              editingId === item.id ? (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.label}</td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      min="0"
                      style={{ ...inputStyle, maxWidth: '160px' }}
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      autoFocus
                    />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ ...btnPrimary, padding: '5px 12px', fontSize: '11px' }} onClick={() => saveEdit(item.id)}>Save</button>
                      <button style={{ ...btnSecondary, padding: '5px 12px', fontSize: '11px' }} onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.label}</td>
                  <td style={tdStyle}>{item.amountEGP.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button style={{ ...btnSecondary, padding: '5px 12px', fontSize: '11px' }} onClick={() => startEdit(item)}>Edit</button>
                  </td>
                </tr>
              )
            ))}
            {adding && (
              <tr>
                <td style={tdStyle}>
                  <input
                    style={inputStyle}
                    placeholder="Label"
                    value={newItem.label}
                    onChange={e => setNewItem(n => ({ ...n, label: e.target.value }))}
                    autoFocus
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    min="0"
                    style={{ ...inputStyle, maxWidth: '160px' }}
                    placeholder="Amount"
                    value={newItem.amountEGP}
                    onChange={e => setNewItem(n => ({ ...n, amountEGP: e.target.value }))}
                  />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ ...btnPrimary, padding: '5px 12px', fontSize: '11px' }} onClick={saveNew}>Save</button>
                    <button style={{ ...btnSecondary, padding: '5px 12px', fontSize: '11px' }} onClick={() => { setAdding(false); setNewItem({ label: '', amountEGP: '' }) }}>Cancel</button>
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ ...tdStyle, fontWeight: '700', color: c.black, borderBottom: 'none' }}>Total Monthly Overhead</td>
              <td style={{ ...tdStyle, fontWeight: '700', color: c.umber, borderBottom: 'none' }}>{total.toLocaleString()}</td>
              <td style={{ ...tdStyle, borderBottom: 'none' }} />
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EmailAlertsSection() {
  const [email, setEmail] = useState({
    alertEmail: initialEmail.alertEmail,
    lowStockAlerts: initialEmail.lowStockAlerts,
    paymentDueAlerts: initialEmail.paymentDueAlerts,
    batchReceivedAlerts: initialEmail.batchReceivedAlerts,
    weeklyDigest: initialEmail.weeklyDigest,
    digestDay: initialEmail.digestDay,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section>
      <SectionHeader title="Email Alerts" subtitle="Configure when automated alerts are sent" />

      <div style={{ maxWidth: '520px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={fieldLabel}>Alert Email Address</label>
          <input
            type="email"
            style={inputStyle}
            value={email.alertEmail}
            onChange={e => setEmail(em => ({ ...em, alertEmail: e.target.value }))}
          />
        </div>

        <Toggle
          label="Low Stock Alerts"
          checked={email.lowStockAlerts}
          onChange={v => setEmail(em => ({ ...em, lowStockAlerts: v }))}
        />
        <Toggle
          label="Payment Due Alerts"
          checked={email.paymentDueAlerts}
          onChange={v => setEmail(em => ({ ...em, paymentDueAlerts: v }))}
        />
        <Toggle
          label="Batch Received Confirmations"
          checked={email.batchReceivedAlerts}
          onChange={v => setEmail(em => ({ ...em, batchReceivedAlerts: v }))}
        />
        <div style={{ borderBottom: `1px solid ${c.softDune}` }}>
          <Toggle
            label="Weekly Digest"
            checked={email.weeklyDigest}
            onChange={v => setEmail(em => ({ ...em, weeklyDigest: v }))}
          />
          {email.weeklyDigest && (
            <div style={{ paddingBottom: '16px', paddingLeft: '0' }}>
              <label style={fieldLabel}>Day of Week</label>
              <select
                style={{ ...inputStyle, maxWidth: '200px' }}
                value={email.digestDay}
                onChange={e => setEmail(em => ({ ...em, digestDay: e.target.value }))}
              >
                {WEEKDAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={btnPrimary} onClick={handleSave}>Save Email Settings</button>
          {saved && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#155724', fontWeight: '600' }}>
              Settings saved.
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

function ExchangeRateSection() {
  const [rate, setRate] = useState(initialRates.liveUSDEGP)
  const [lastUpdated] = useState(initialRates.lastUpdated)
  const [override, setOverride] = useState(String(initialRates.liveUSDEGP))
  const [updated, setUpdated] = useState(false)

  const handleUpdate = () => {
    const val = parseFloat(override)
    if (!isNaN(val) && val > 0) {
      setRate(val)
      setUpdated(true)
      setTimeout(() => setUpdated(false), 2000)
    }
  }

  return (
    <section>
      <SectionHeader title="Exchange Rate" subtitle="USD to EGP rate used for cost calculations" />

      <div style={{ maxWidth: '420px' }}>
        <div style={{
          backgroundColor: '#fff', border: `1px solid ${c.softDune}`,
          borderRadius: '8px', padding: '20px 24px', marginBottom: '24px',
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: '600', color: c.umber, marginBottom: '6px' }}>
            1 USD = EGP {rate}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.taupe }}>
            Last updated: {lastUpdated}
          </div>
        </div>

        <div>
          <label style={fieldLabel}>Manual Override</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="number"
              step="0.01"
              min="0"
              style={{ ...inputStyle, flex: '1 1 160px', maxWidth: '200px' }}
              value={override}
              onChange={e => setOverride(e.target.value)}
            />
            <button style={btnPrimary} onClick={handleUpdate}>Update Rate</button>
          </div>
          {updated && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#155724', fontWeight: '600', marginTop: '10px' }}>
              Rate updated.
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.taupe, marginTop: '12px' }}>
            In future this will be fetched automatically daily
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Settings() {
  const { isMobile } = useWindowSize()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '500', color: c.black, marginBottom: '40px' }}>
        Settings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <ProductsSection isMobile={isMobile} />
        <OverheadSection />
        <EmailAlertsSection />
        <ExchangeRateSection />
      </div>
    </div>
  )
}
