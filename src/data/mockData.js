export const colors = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

export const products = [
  { id: 'AR-001', name: 'Sea Mist',             category: 'Body Mist',  reorderThreshold: 200, sellingPriceEGP: 1200 },
  { id: 'AR-002', name: 'Body Lotion',           category: 'Body Care',  reorderThreshold: 200, sellingPriceEGP: 1500 },
  { id: 'AR-003', name: 'Exfoliating Hand Wash', category: 'Hand Care',  reorderThreshold: 150, sellingPriceEGP: 900  },
]

export const suppliers = [
  {
    id: 'SUP-001',
    name: 'Cairo Packaging Co.',
    type: 'packaging',
    contact: 'Ahmed Hassan',
    email: 'a.hassan@cairopkg.com',
    phone: '+20 2 2345 6789',
    address: '14 Nasr City Industrial Zone, Cairo, Egypt',
    paymentTerms: '50% deposit, 50% on delivery',
    currency: 'USD',
    leadTimeDays: 28,
  },
  {
    id: 'SUP-002',
    name: 'Delta Manufacturing',
    type: 'liquid',
    contact: 'Sarah Adel',
    email: 's.adel@deltamfg.com',
    phone: '+20 2 9876 5432',
    address: '7 El Obour Industrial District, Cairo, Egypt',
    paymentTerms: '30% deposit, 70% on delivery',
    currency: 'USD',
    leadTimeDays: 35,
  },
  {
    id: 'SUP-003',
    name: 'Branding Co.',
    type: 'branding',
    contact: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: '',
    currency: 'USD',
    leadTimeDays: 14,
  },
]

// Exchange rates — fetched daily by AI, locked per batch at order creation
export const exchangeRates = {
  liveUSDEGP: 49.50,       // mock live rate — AI updates this daily
  lastUpdated: '2025-05-25',
}

export const batches = [
  {
    id: 'BATCH-001',
    productId: 'AR-001',
    productName: 'Sea Mist',
    batchNumber: 'SM-2025-001',
    orderDate: '2025-01-10',
    receivedDate: '2025-02-20',
    status: 'received',
    totalUnits: 500,
    unitsRemaining: 320,
    isFifoActive: true,
    lockedRateUSDEGP: 48.20,
    supplierCosts: [
      {
        supplierId: 'SUP-001',
        supplierName: 'Cairo Packaging Co.',
        perUnitUSD: 2.40,
        totalUSD: 1200.00,
        depositPaid: true,
        depositAmount: 600.00,
        depositDate: '2025-01-12',
        finalPaid: true,
        finalAmount: 600.00,
        finalDate: '2025-02-22',
      },
      {
        supplierId: 'SUP-002',
        supplierName: 'Delta Manufacturing',
        perUnitUSD: 8.60,
        totalUSD: 4300.00,
        depositPaid: true,
        depositAmount: 1290.00,
        depositDate: '2025-01-12',
        finalPaid: true,
        finalAmount: 3010.00,
        finalDate: '2025-02-22',
      },
    ],
    weightedAvgCostUSD: 11.00,
    notes: 'First production run. All payments settled.',
  },
  {
    id: 'BATCH-002',
    productId: 'AR-002',
    productName: 'Body Lotion',
    batchNumber: 'BL-2025-001',
    orderDate: '2025-03-01',
    receivedDate: null,
    status: 'in-transit',
    totalUnits: 300,
    unitsRemaining: 0,
    isFifoActive: false,
    lockedRateUSDEGP: 49.10,
    supplierCosts: [
      {
        supplierId: 'SUP-001',
        supplierName: 'Cairo Packaging Co.',
        perUnitUSD: 3.20,
        totalUSD: 960.00,
        depositPaid: true,
        depositAmount: 480.00,
        depositDate: '2025-03-03',
        finalPaid: false,
        finalAmount: 480.00,
        finalDate: null,
      },
      {
        supplierId: 'SUP-002',
        supplierName: 'Delta Manufacturing',
        perUnitUSD: 15.00,
        totalUSD: 4500.00,
        depositPaid: true,
        depositAmount: 1350.00,
        depositDate: '2025-03-03',
        finalPaid: false,
        finalAmount: 3150.00,
        finalDate: null,
      },
    ],
    weightedAvgCostUSD: 18.20,
    notes: 'ETA mid-April. Final payments due on delivery.',
  },
]

// Monthly overhead — all in EGP, Ahmed configures in Settings
export const overheadEntries = [
  { id: 'OH-001', label: 'Accountant',         amountEGP: 3000  },
  { id: 'OH-002', label: 'KMT AI',             amountEGP: 5000  },
  { id: 'OH-003', label: 'Subscriptions',      amountEGP: 1500  },
  { id: 'OH-004', label: 'Managing Directors', amountEGP: 25000 },
  { id: 'OH-005', label: 'Marketing',          amountEGP: 8000  },
  { id: 'OH-006', label: 'Delivery',           amountEGP: 3000  },
]

export const paymentHistory = {
  'SUP-001': [
    { date: '2025-01-12', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'deposit', amount: 600.00,  method: 'Bank Transfer', ref: 'CPK-250112' },
    { date: '2025-02-22', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'final',   amount: 600.00,  method: 'Bank Transfer', ref: 'CPK-250222' },
    { date: '2025-03-03', batchId: 'BATCH-002', batchNumber: 'BL-2025-001', type: 'deposit', amount: 480.00,  method: 'Bank Transfer', ref: 'CPK-250303' },
    { date: null,         batchId: 'BATCH-002', batchNumber: 'BL-2025-001', type: 'final',   amount: 480.00,  method: 'Pending',       ref: '—' },
  ],
  'SUP-002': [
    { date: '2025-01-12', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'deposit', amount: 1290.00, method: 'Bank Transfer', ref: 'DLT-250112' },
    { date: '2025-02-22', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'final',   amount: 3010.00, method: 'Bank Transfer', ref: 'DLT-250222' },
    { date: '2025-03-03', batchId: 'BATCH-002', batchNumber: 'BL-2025-001', type: 'deposit', amount: 1350.00, method: 'Bank Transfer', ref: 'DLT-250303' },
    { date: null,         batchId: 'BATCH-002', batchNumber: 'BL-2025-001', type: 'final',   amount: 3150.00, method: 'Pending',       ref: '—' },
  ],
}

export const outstandingPayments = batches.flatMap(b =>
  b.supplierCosts
    .filter(sc => !sc.finalPaid)
    .map(sc => ({
      batchId: b.id,
      batchNumber: b.batchNumber,
      productName: b.productName,
      supplierId: sc.supplierId,
      supplierName: sc.supplierName,
      type: sc.depositPaid ? 'Final Payment' : 'Deposit',
      amount: sc.depositPaid ? sc.finalAmount : sc.depositAmount,
      status: 'outstanding',
    }))
)

export const stockLevels = products.map(p => {
  const productBatches = batches.filter(b => b.productId === p.id && b.status === 'received')
  const totalUnits = productBatches.reduce((sum, b) => sum + b.totalUnits, 0)
  const activeBatch = productBatches.find(b => b.isFifoActive)
  return {
    ...p,
    totalUnits,
    activeBatch: activeBatch?.batchNumber || '—',
    status: totalUnits === 0 ? 'out' : totalUnits < p.reorderThreshold ? 'low' : 'ok',
  }
})

// Fully-loaded margin in EGP
export const weightedAvgCosts = products.map(p => {
  const received = batches.filter(b => b.productId === p.id && b.status === 'received')

  if (received.length === 0) return {
    productId: p.id,
    productName: p.name,
    wacUSD: 0,
    wacEGP: 0,
    totalUnits: 0,
    sellingPriceEGP: p.sellingPriceEGP,
    overheadPerUnitEGP: 0,
    fullyLoadedCostEGP: 0,
    marginPct: 0,
    pricingFloorEGP: 0,
  }

  const totalUnits = received.reduce((sum, b) => sum + b.totalUnits, 0)
  const totalValueUSD = received.reduce((sum, b) => sum + b.weightedAvgCostUSD * b.totalUnits, 0)
  const wacUSD = totalValueUSD / totalUnits

  // Convert WAC to EGP using each batch's locked rate
  const totalValueEGP = received.reduce((sum, b) => sum + b.weightedAvgCostUSD * b.lockedRateUSDEGP * b.totalUnits, 0)
  const wacEGP = totalValueEGP / totalUnits

  // Allocate monthly overhead proportionally by units across all received products
  const totalMonthlyOverheadEGP = overheadEntries.reduce((sum, o) => sum + o.amountEGP, 0)
  const allReceivedUnits = batches.filter(b => b.status === 'received').reduce((sum, b) => sum + b.totalUnits, 0)
  const overheadPerUnitEGP = allReceivedUnits > 0 ? totalMonthlyOverheadEGP / allReceivedUnits : 0

  const fullyLoadedCostEGP = wacEGP + overheadPerUnitEGP

  return {
    productId: p.id,
    productName: p.name,
    wacUSD: parseFloat(wacUSD.toFixed(2)),
    wacEGP: parseFloat(wacEGP.toFixed(2)),
    totalUnits,
    sellingPriceEGP: p.sellingPriceEGP,
    overheadPerUnitEGP: parseFloat(overheadPerUnitEGP.toFixed(2)),
    fullyLoadedCostEGP: parseFloat(fullyLoadedCostEGP.toFixed(2)),
    marginPct: parseFloat(((p.sellingPriceEGP - fullyLoadedCostEGP) / p.sellingPriceEGP * 100).toFixed(1)),
    pricingFloorEGP: parseFloat((fullyLoadedCostEGP * 1.3).toFixed(2)),
  }
})

export const emailSettings = {
  alertEmail: 'supply@ardarituals.com',
  lowStockAlerts: true,
  paymentDueAlerts: true,
  batchReceivedAlerts: true,
  weeklyDigest: true,
  digestDay: 'Monday',
}

export const shopifySettings = {
  apiKey: '',
  storeUrl: '',
  connected: false,
}
