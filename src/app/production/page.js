'use client'

import { useState, useEffect, Fragment } from 'react'
import { products, suppliers, batches as initialBatches } from '@/data/mockData'

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
const tdStyle = { padding: '12px 16px 12px 0', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#252525', borderBottom: '1px solid #E4DDCC', verticalAlign: 'top' }

const BATCH_STATUS = {
  received:     { bg: '#d4edda', color: '#155724', label: 'Received' },
  'in-transit': { bg: '#fff3cd', color: '#856404', label: 'In Transit' },
  pending:      { bg: '#E4DDCC', color: '#443A35', label: 'Pending' },
}

const SUPPLIER_TYPE_STYLE = {
  packaging: { bg: c.softDune, color: c.umber, border: 'none' },
  liquid:    { bg: c.taupe, color: '#fff', border: 'none' },
  branding:  { bg: c.vanilla, color: c.umber, border: `1px solid ${c.softDune}` },
  other:     { bg: c.vanilla, color: c.umber, border: `1px solid ${c.softDune}` },
}

const DOCUMENTS = [
  { id: 1, name: 'PO-SM-2025-001',  batch: 'SM-2025-001', supplier: 'Cairo Packaging Co.', date: '2025-01-10', type: 'PO' },
  { id: 2, name: 'REC-SM-2025-001', batch: 'SM-2025-001', supplier: 'Cairo Packaging Co.', date: '2025-02-14', type: 'RECEIPT' },
  { id: 3, name: 'PO-BL-2025-001',  batch: 'BL-2025-001', supplier: 'Delta Manufacturing', date: '2025-03-01', type: 'PO' },
  { id: 4, name: 'PO-BL-2025-001B', batch: 'BL-2025-001', supplier: 'Cairo Packaging Co.', date: '2025-03-01', type: 'PO' },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function StatusPill({ status }) {
  const s = BATCH_STATUS[status] || BATCH_STATUS.pending
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em',
      textTransform: 'uppercase', backgroundColor: s.bg, color: s.color,
      fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

function PaymentPill({ paid }) {
  const label = paid ? 'PAID' : 'PENDING'
  const bg = paid ? '#d4edda' : '#fff3cd'
  const color = paid ? '#155724' : '#856404'
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em',
      backgroundColor: bg, color, fontFamily: 'var(--font-body)',
    }}>{label}</span>
  )
}

function DocTypePill({ type }) {
  const isPO = type === 'PO'
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em',
      backgroundColor: isPO ? c.softDune : c.vanilla,
      color: c.umber,
      border: isPO ? 'none' : `1px solid ${c.softDune}`,
      fontFamily: 'var(--font-body)',
    }}>{type}</span>
  )
}

function SupplierTypePill({ type }) {
  const s = SUPPLIER_TYPE_STYLE[type] || SUPPLIER_TYPE_STYLE.other
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '600', textTransform: 'capitalize',
      backgroundColor: s.bg, color: s.color, border: s.border,
      fontFamily: 'var(--font-body)', marginLeft: '10px',
    }}>{type}</span>
  )
}

function Backdrop({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.35)',
        zIndex: 200,
      }}
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
        backgroundColor: '#fff',
        zIndex: 300,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: `1px solid ${c.softDune}`,
          flexShrink: 0,
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ ...btnSecondary, padding: '6px 12px' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
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
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '420px', maxWidth: 'calc(100vw - 32px)',
        backgroundColor: '#fff', borderRadius: '8px',
        zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: '24px',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, margin: '0 0 20px' }}>{title}</h2>
        {children}
      </div>
    </>
  )
}

function TabSwitcher({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '24px', borderBottom: `1px solid ${c.softDune}`, marginBottom: '28px' }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600',
            color: active === tab ? c.umber : c.taupe,
            borderBottom: active === tab ? `2px solid ${c.umber}` : '2px solid transparent',
            marginBottom: '-1px',
            letterSpacing: '0.04em',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function BatchExpandedRow({ batch, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0, borderBottom: `1px solid ${c.softDune}`, backgroundColor: c.vanilla }}>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Cost Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {batch.supplierCosts.map((sc, i) => (
              <div key={i} style={{
                backgroundColor: '#fff', border: `1px solid ${c.softDune}`,
                borderRadius: '6px', padding: '14px 16px',
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: '600', color: c.black, marginBottom: '8px' }}>
                  {sc.supplierName}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)' }}>Per Unit</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: c.black, fontFamily: 'var(--font-body)' }}>${sc.perUnitUSD.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)' }}>Total</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: c.black, fontFamily: 'var(--font-body)' }}>${sc.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)' }}>Deposit</span>
                    <PaymentPill paid={sc.depositPaid} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)' }}>Final</span>
                    <PaymentPill paid={sc.finalPaid} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.umber }}>
            Locked Rate: 1 USD = EGP {batch.lockedRateUSDEGP}
          </div>
          {batch.notes && (
            <div style={{ marginTop: '12px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.taupe, fontStyle: 'italic' }}>
              {batch.notes}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

function BatchesTab({ isMobile, batches }) {
  const [expanded, setExpanded] = useState({})
  const [panelOpen, setPanelOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    productId: products[0]?.id || '',
    orderDate: todayISO(),
    totalUnits: '',
    notes: '',
    supplierCosts: Object.fromEntries(suppliers.map(s => [s.id, ''])),
  })

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const perUnitSum = suppliers.reduce((sum, s) => {
    const v = parseFloat(form.supplierCosts[s.id]) || 0
    return sum + v
  }, 0)
  const totalUnits = parseFloat(form.totalUnits) || 0
  const estimatedTotal = perUnitSum * totalUnits

  const handleCreate = () => {
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setPanelOpen(false)
      setForm({
        productId: products[0]?.id || '',
        orderDate: todayISO(),
        totalUnits: '',
        notes: '',
        supplierCosts: Object.fromEntries(suppliers.map(s => [s.id, ''])),
      })
    }, 2000)
  }

  const desktopCols = ['Batch Number', 'Product', 'Order Date', 'Units', 'Suppliers', 'WAC (USD)', 'Status', '']
  const mobileCols = ['Batch Number', 'Product', 'Status', '']
  const cols = isMobile ? mobileCols : desktopCols
  const colSpan = cols.length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={btnPrimary} onClick={() => setPanelOpen(true)}>+ New Batch</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '320px' : '700px' }}>
          <thead>
            <tr>
              {cols.map((h, i) => (
                <th key={i} style={{ ...thStyle, paddingRight: h ? '16px' : '8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batches.map(b => {
              const product = products.find(p => p.id === b.productId)
              const supplierNames = b.supplierCosts.map(sc => sc.supplierName).join(', ')
              const isOpen = !!expanded[b.id]
              return (
                <Fragment key={b.id}>
                  <tr>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '600', color: c.umber, fontFamily: 'var(--font-body)' }}>{b.batchNumber}</div>
                      <div style={{ fontSize: '11px', color: c.taupe, marginTop: '2px', fontFamily: 'var(--font-body)' }}>{b.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontFamily: 'var(--font-body)' }}>{b.productName}</div>
                      {product && (
                        <div style={{ fontSize: '11px', color: c.taupe, marginTop: '2px', fontFamily: 'var(--font-body)' }}>{product.id}</div>
                      )}
                    </td>
                    {!isMobile && (
                      <>
                        <td style={tdStyle}>{b.orderDate}</td>
                        <td style={tdStyle}>{b.totalUnits.toLocaleString()}</td>
                        <td style={{ ...tdStyle, maxWidth: '200px' }}>{supplierNames}</td>
                        <td style={tdStyle}>${b.weightedAvgCostUSD.toFixed(2)}</td>
                      </>
                    )}
                    <td style={tdStyle}><StatusPill status={b.status} /></td>
                    <td style={{ ...tdStyle, paddingRight: '8px', width: '40px' }}>
                      <button
                        onClick={() => toggle(b.id)}
                        style={{
                          background: 'none', border: `1px solid ${c.softDune}`, borderRadius: '4px',
                          cursor: 'pointer', padding: '4px 8px', fontSize: '12px', color: c.umber,
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {isOpen ? '▴' : '▾'}
                      </button>
                    </td>
                  </tr>
                  {isOpen && <BatchExpandedRow batch={b} colSpan={colSpan} />}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <SlideInPanel open={panelOpen} onClose={() => setPanelOpen(false)} title="New Batch" isMobile={isMobile}>
        {success ? (
          <div style={{
            backgroundColor: '#d4edda', color: '#155724', padding: '16px',
            borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: '600',
          }}>
            Batch created successfully.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={fieldLabel}>Product</label>
              <select
                style={inputStyle}
                value={form.productId}
                onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={fieldLabel}>Order Date</label>
              <input
                type="date"
                style={inputStyle}
                value={form.orderDate}
                onChange={e => setForm(f => ({ ...f, orderDate: e.target.value }))}
              />
            </div>
            <div>
              <label style={fieldLabel}>Total Units</label>
              <input
                type="number"
                style={inputStyle}
                value={form.totalUnits}
                onChange={e => setForm(f => ({ ...f, totalUnits: e.target.value }))}
                min="0"
              />
            </div>
            <div>
              <div style={{ ...fieldLabel, marginBottom: '12px' }}>Supplier Costs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {suppliers.map(s => (
                  <div key={s.id}>
                    <label style={{ fontSize: '12px', color: c.umber, fontFamily: 'var(--font-body)', display: 'block', marginBottom: '4px' }}>
                      {s.name}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Per unit USD"
                      style={inputStyle}
                      value={form.supplierCosts[s.id]}
                      onChange={e => setForm(f => ({
                        ...f,
                        supplierCosts: { ...f.supplierCosts, [s.id]: e.target.value },
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              backgroundColor: c.softDune, borderRadius: '6px', padding: '14px 16px',
              fontFamily: 'var(--font-body)', fontSize: '13px', color: c.umber,
            }}>
              Estimated WAC: <strong>${perUnitSum.toFixed(2)}</strong> per unit
              {totalUnits > 0 && (
                <> · Total: <strong>${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></>
              )}
            </div>
            <div>
              <label style={fieldLabel}>Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <button style={{ ...btnPrimary, width: '100%' }} onClick={handleCreate}>Create Batch</button>
          </div>
        )}
      </SlideInPanel>
    </div>
  )
}

function SuppliersTab({ isMobile, batches, supplierList }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'packaging', contact: '', email: '',
    paymentTerms: '', leadTimeDays: '',
  })

  const handleSave = () => {
    setPanelOpen(false)
    setForm({ name: '', type: 'packaging', contact: '', email: '', paymentTerms: '', leadTimeDays: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={btnPrimary} onClick={() => setPanelOpen(true)}>+ Add Supplier</button>
      </div>

      {supplierList.map((supplier, idx) => {
        const supplierBatches = batches.filter(b =>
          b.supplierCosts.some(sc => sc.supplierId === supplier.id)
        )
        return (
          <div key={supplier.id}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black }}>
                  {supplier.name}
                </span>
                <SupplierTypePill type={supplier.type} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '20px',
              }}>
                {[
                  { label: 'Contact', value: supplier.contact || '—' },
                  { label: 'Email', value: supplier.email || '—' },
                  { label: 'Payment Terms', value: supplier.paymentTerms || '—' },
                  { label: 'Lead Time', value: supplier.leadTimeDays ? `${supplier.leadTimeDays} days` : '—' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ ...fieldLabel, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Batch History
              </div>
              {supplierBatches.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: c.taupe }}>No batches yet</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Batch Number', 'Product', 'Deposit', 'Final'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {supplierBatches.map(b => {
                        const sc = b.supplierCosts.find(s => s.supplierId === supplier.id)
                        return (
                          <tr key={b.id}>
                            <td style={{ ...tdStyle, fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                            <td style={tdStyle}>{b.productName}</td>
                            <td style={tdStyle}><PaymentPill paid={sc?.depositPaid} /></td>
                            <td style={tdStyle}><PaymentPill paid={sc?.finalPaid} /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {idx < supplierList.length - 1 && (
              <div style={{ height: '1px', backgroundColor: c.softDune, marginBottom: '28px' }} />
            )}
          </div>
        )
      })}

      <SlideInPanel open={panelOpen} onClose={() => setPanelOpen(false)} title="Add Supplier" isMobile={isMobile}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={fieldLabel}>Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={fieldLabel}>Type</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {['packaging', 'liquid', 'branding', 'other'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Contact</label>
            <input style={inputStyle} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          </div>
          <div>
            <label style={fieldLabel}>Email</label>
            <input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={fieldLabel}>Payment Terms</label>
            <input style={inputStyle} value={form.paymentTerms} onChange={e => setForm(f => ({ ...f, paymentTerms: e.target.value }))} />
          </div>
          <div>
            <label style={fieldLabel}>Lead Time Days</label>
            <input type="number" style={inputStyle} value={form.leadTimeDays} onChange={e => setForm(f => ({ ...f, leadTimeDays: e.target.value }))} min="0" />
          </div>
          <button style={{ ...btnPrimary, width: '100%' }} onClick={handleSave}>Save</button>
        </div>
      </SlideInPanel>
    </div>
  )
}

function DocumentsTab({ isMobile, batches }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [genForm, setGenForm] = useState({
    supplierId: suppliers[0]?.id || '',
    batchNumber: batches[0]?.batchNumber || '',
    type: 'PO',
  })

  const desktopCols = ['Document', 'Batch', 'Supplier', 'Date', 'Type', 'Actions']
  const mobileCols = ['Document', 'Type', 'Actions']
  const cols = isMobile ? mobileCols : desktopCols

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={btnPrimary} onClick={() => setModalOpen(true)}>Generate Document</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '280px' : '600px' }}>
          <thead>
            <tr>
              {cols.map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map(doc => (
              <tr key={doc.id}>
                <td style={{ ...tdStyle, fontWeight: '600', color: c.umber }}>{doc.name}</td>
                {!isMobile && (
                  <>
                    <td style={tdStyle}>{doc.batch}</td>
                    <td style={tdStyle}>{doc.supplier}</td>
                    <td style={tdStyle}>{doc.date}</td>
                  </>
                )}
                <td style={tdStyle}><DocTypePill type={doc.type} /></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      title="Download"
                      style={{
                        background: 'none', border: `1px solid ${c.softDune}`, borderRadius: '4px',
                        cursor: 'pointer', padding: '5px 8px', fontSize: '14px', color: c.umber,
                      }}
                    >
                      ↓
                    </button>
                    <button style={{ ...btnSecondary, padding: '5px 12px', fontSize: '11px' }}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CenteredModal open={modalOpen} onClose={() => setModalOpen(false)} title="Generate Document">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={fieldLabel}>Supplier</label>
            <select
              style={inputStyle}
              value={genForm.supplierId}
              onChange={e => setGenForm(f => ({ ...f, supplierId: e.target.value }))}
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Batch</label>
            <select
              style={inputStyle}
              value={genForm.batchNumber}
              onChange={e => setGenForm(f => ({ ...f, batchNumber: e.target.value }))}
            >
              {batches.map(b => (
                <option key={b.id} value={b.batchNumber}>{b.batchNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Type</label>
            <select
              style={inputStyle}
              value={genForm.type}
              onChange={e => setGenForm(f => ({ ...f, type: e.target.value }))}
            >
              <option value="PO">PO</option>
              <option value="RECEIPT">Receipt</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button style={{ ...btnPrimary, flex: 1 }} onClick={() => setModalOpen(false)}>Generate</button>
            <button style={{ ...btnSecondary, flex: 1 }} onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      </CenteredModal>
    </div>
  )
}

export default function Production() {
  const { isMobile } = useWindowSize()
  const [activeTab, setActiveTab] = useState('Batches')
  const [batchList] = useState(initialBatches)
  const [supplierList] = useState(suppliers)

  const tabs = ['Batches', 'Suppliers', 'Documents']

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '500', color: c.black, marginBottom: '24px' }}>
        Production
      </h1>

      <TabSwitcher tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Batches' && <BatchesTab isMobile={isMobile} batches={batchList} />}
      {activeTab === 'Suppliers' && <SuppliersTab isMobile={isMobile} batches={batchList} supplierList={supplierList} />}
      {activeTab === 'Documents' && <DocumentsTab isMobile={isMobile} batches={batchList} />}
    </div>
  )
}
