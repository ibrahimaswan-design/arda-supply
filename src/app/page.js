'use client'

import { useState, useEffect } from 'react'
import { products, batches, overheadEntries, exchangeRates } from '@/data/mockData'

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

function computeProducts() {
  return products.map(p => {
    const productBatches = batches.filter(b => b.productId === p.id && b.status === 'received')
    const allProductBatches = batches.filter(b => b.productId === p.id)
    const totalUnits = productBatches.reduce((sum, b) => sum + b.totalUnits, 0)
    const activeBatch = productBatches.find(b => b.isFifoActive)
    const inTransitBatch = allProductBatches.find(b => b.status === 'in-transit')
    const pendingBatch = allProductBatches.find(b => b.status === 'pending')
    const stockStatus = totalUnits === 0 ? 'out' : totalUnits < p.reorderThreshold ? 'low' : 'ok'

    let wacUSD = 0, wacEGP = 0, marginPct = 0, fullyLoadedCostEGP = 0

    if (productBatches.length > 0 && totalUnits > 0) {
      const totalValueUSD = productBatches.reduce((sum, b) => sum + b.weightedAvgCostUSD * b.totalUnits, 0)
      const totalValueEGP = productBatches.reduce((sum, b) => sum + b.weightedAvgCostUSD * b.lockedRateUSDEGP * b.totalUnits, 0)
      wacUSD = totalValueUSD / totalUnits
      wacEGP = totalValueEGP / totalUnits
      const totalMonthlyOverheadEGP = overheadEntries.reduce((sum, o) => sum + o.amountEGP, 0)
      const allReceivedUnits = batches.filter(b => b.status === 'received').reduce((sum, b) => sum + b.totalUnits, 0)
      const overheadPerUnitEGP = allReceivedUnits > 0 ? totalMonthlyOverheadEGP / allReceivedUnits : 0
      fullyLoadedCostEGP = wacEGP + overheadPerUnitEGP
      marginPct = p.sellingPriceEGP > 0 ? ((p.sellingPriceEGP - fullyLoadedCostEGP) / p.sellingPriceEGP * 100) : 0
    }

    return {
      id: p.id,
      name: p.name,
      sellingPriceEGP: p.sellingPriceEGP,
      reorderThreshold: p.reorderThreshold,
      totalUnits,
      stockStatus,
      activeBatch,
      inTransitBatch,
      pendingBatch,
      wacUSD: parseFloat(wacUSD.toFixed(2)),
      wacEGP: parseFloat(wacEGP.toFixed(0)),
      marginPct: parseFloat(marginPct.toFixed(1)),
      fullyLoadedCostEGP: parseFloat(fullyLoadedCostEGP.toFixed(0)),
    }
  })
}

function computeOutstandingPayments() {
  return batches.flatMap(b =>
    b.supplierCosts
      .filter(sc => !sc.depositPaid || !sc.finalPaid)
      .map(sc => ({
        batchId: b.id,
        batchNumber: b.batchNumber,
        productName: b.productName,
        supplierName: sc.supplierName,
        depositPaid: sc.depositPaid,
        finalPaid: sc.finalPaid,
        depositAmount: sc.depositAmount,
        finalAmount: sc.finalAmount,
      }))
  )
}

const STOCK_COLORS = {
  ok:  { bg: '#eaf4ee', color: '#2d6a4f', label: 'OK' },
  low: { bg: '#fff3cd', color: '#856404', label: 'LOW' },
  out: { bg: '#f8d7da', color: '#721c24', label: 'OUT' },
}

const BATCH_STATUS_COLORS = {
  received:     { bg: '#eaf4ee', color: '#2d6a4f' },
  'in-transit': { bg: '#fff3cd', color: '#856404' },
  pending:      { bg: c.softDune, color: c.umber },
}

function StockPill({ status }) {
  const s = STOCK_COLORS[status] || STOCK_COLORS.out
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.07em',
      textTransform: 'uppercase', backgroundColor: s.bg, color: s.color,
      fontFamily: 'var(--font-body)',
    }}>{s.label}</span>
  )
}

function BatchPill({ status, label }) {
  const s = BATCH_STATUS_COLORS[status] || BATCH_STATUS_COLORS.pending
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '600', backgroundColor: s.bg, color: s.color,
      fontFamily: 'var(--font-body)',
    }}>{label}</span>
  )
}

function StockBar({ units, threshold, max }) {
  const pct = max > 0 ? Math.min((units / max) * 100, 100) : 0
  const color = units === 0 ? '#f5c6cb' : units < threshold ? '#ffeeba' : '#c3e6cb'
  return (
    <div style={{ width: '100%', height: '6px', backgroundColor: c.softDune, borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
    </div>
  )
}

function ProductCard({ product, isMobile }) {
  const { activeBatch, inTransitBatch, pendingBatch } = product
  const batchMax = activeBatch ? activeBatch.totalUnits : product.reorderThreshold * 2

  return (
    <div style={{
      backgroundColor: '#fff',
      border: `1px solid ${c.softDune}`,
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black }}>{product.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginTop: '2px' }}>{product.id}</div>
        </div>
        <StockPill status={product.stockStatus} />
      </div>

      {/* Stock bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '28px', fontWeight: '600', color: c.umber }}>{product.totalUnits.toLocaleString()}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe }}>units in stock</span>
        </div>
        <StockBar units={product.totalUnits} threshold={product.reorderThreshold} max={batchMax} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginTop: '4px' }}>
          Reorder threshold: {product.reorderThreshold} units
        </div>
      </div>

      {/* Batch status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Batches</div>
        {activeBatch ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.black }}>{activeBatch.batchNumber}</span>
            <BatchPill status="received" label="Active" />
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.taupe }}>No active batch</div>
        )}
        {inTransitBatch && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.black }}>{inTransitBatch.batchNumber}</span>
            <BatchPill status="in-transit" label="In Transit" />
          </div>
        )}
        {pendingBatch && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.black }}>{pendingBatch.batchNumber}</span>
            <BatchPill status="pending" label="Pending" />
          </div>
        )}
        {!inTransitBatch && !pendingBatch && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: c.taupe }}>No batch ordered</div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: c.softDune }} />

      {/* Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
      <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginBottom: '3px' }}>WAC</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: c.black }}>${product.wacUSD.toFixed(2)}</div>
        </div>
        <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginBottom: '3px' }}>Price (EGP)</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '600', color: c.black }}>{product.sellingPriceEGP.toLocaleString()}</div>        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginBottom: '3px' }}>Margin</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: product.marginPct > 40 ? '#2d6a4f' : product.marginPct > 20 ? '#856404' : '#721c24' }}>
            {product.marginPct > 0 ? `${product.marginPct.toFixed(1)}%` : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { isMobile } = useWindowSize()
  const PRODUCTS = computeProducts()
  const outstanding = computeOutstandingPayments()

  const totalUnits = PRODUCTS.reduce((sum, p) => sum + p.totalUnits, 0)
  const activeBatches = batches.filter(b => b.status === 'received' || b.status === 'in-transit').length
  const outstandingCount = outstanding.length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '500', color: c.black }}>Dashboard</h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginTop: '4px' }}>
          Live Rate: 1 USD = EGP {exchangeRates.liveUSDEGP} · Updated {exchangeRates.lastUpdated}
        </div>
      </div>

      {/* Metrics strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: '1px',
        backgroundColor: c.softDune,
        border: `1px solid ${c.softDune}`,
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '32px',
      }}>
        {[
          { label: 'Total Units in Stock', value: totalUnits.toLocaleString() },
          { label: 'Outstanding Payments', value: outstandingCount.toString(), alert: outstandingCount > 0 },
          { label: 'Active Batches', value: activeBatches.toString() },
        ].map((m, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: '600', color: m.alert ? '#856404' : c.umber }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Product cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {PRODUCTS.map(p => <ProductCard key={p.id} product={p} isMobile={isMobile} />)}
      </div>

      {/* Outstanding payments */}
      {outstanding.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: c.black, marginBottom: '16px' }}>Outstanding Payments</div>
          <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: c.vanilla }}>
                  {['Supplier', 'Batch', 'Product', 'Type', 'Amount (USD)'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.softDune}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outstanding.flatMap((o, i) => {
                  const rows = []
                  if (!o.depositPaid) rows.push(
                    <tr key={`${i}-dep`} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>{o.supplierName}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: c.umber, borderBottom: `1px solid ${c.softDune}` }}>{o.batchNumber}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>{o.productName}</td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${c.softDune}` }}><span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: '700', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>Deposit</span></td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>${o.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                  if (!o.finalPaid) rows.push(
                    <tr key={`${i}-fin`} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>{o.supplierName}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: c.umber, borderBottom: `1px solid ${c.softDune}` }}>{o.batchNumber}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>{o.productName}</td>
                      <td style={{ padding: '12px 16px', borderBottom: `1px solid ${c.softDune}` }}><span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: '700', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>Final</span></td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: c.black, borderBottom: `1px solid ${c.softDune}` }}>${o.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                  return rows
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}