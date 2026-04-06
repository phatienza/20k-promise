'use client'
import { useState } from 'react'
import { EnrichedMergedHolding } from '@/lib/types'

interface MergedHoldingBase {
  ticker: string
  name: string
  exchange: string
  totalShares: number
  avgCost: number
  totalCost: number
  totalFees: number
  firstBought: string
  lastBought: string
  reason: string
  buyHistory: {
    date: string
    shares: number
    pricePerShare: number
    totalCost: number
    fees: number
    reason: string
  }[]
}

interface Props {
  holdings: MergedHoldingBase[]
}

function formatPHP(n: number | null, decimals = 2) {
  if (n === null) return '—'
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function GainBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-[#9A9088] text-sm">—</span>
  const positive = pct >= 0
  return (
    <span className="inline-block text-xs font-medium px-2 py-1 rounded-full"
      style={{
        background: positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        color: positive ? '#4ADE80' : '#F87171',
      }}>
      {positive ? '+' : ''}{pct.toFixed(2)}%
    </span>
  )
}

function HoldingCard({
  h, portPct, currentPrice, currentValue, gainLoss, gainLossPct, loading
}: {
  h: MergedHoldingBase
  portPct: number
  currentPrice: number | null
  currentValue: number | null
  gainLoss: number | null
  gainLossPct: number | null
  loading: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const isMultiBuy = h.buyHistory.length > 1

  return (
    <div className="card card-hover">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #F0CC7A)', color: '#0D1F3C' }}>
              {h.ticker.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-medium">{h.name}</p>
                {isMultiBuy && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                    {h.buyHistory.length} buys
                  </span>
                )}
              </div>
              <p className="text-[#9A9088] text-sm">
                {h.totalShares} shares · avg {formatPHP(h.avgCost)} · since {new Date(h.firstBought).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-right">
            <div>
              <p className="text-[#9A9088] text-xs mb-1">Live Price</p>
              <p className="text-white font-medium">
                {loading ? (
                  <span className="text-[#9A9088] animate-pulse">Fetching…</span>
                ) : currentPrice ? formatPHP(currentPrice) : (
                  <span className="text-[#9A9088]">Unavailable</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[#9A9088] text-xs mb-1">Current Value</p>
              <p className="text-white font-medium">{loading ? <span className="text-[#9A9088] animate-pulse">—</span> : formatPHP(currentValue)}</p>
            </div>
            <div>
              <p className="text-[#9A9088] text-xs mb-1">Gain / Loss</p>
              <p className={`font-medium ${(gainLoss ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {loading ? <span className="text-[#9A9088] animate-pulse">—</span> :
                  gainLoss !== null ? ((gainLoss >= 0 ? '+' : '') + formatPHP(gainLoss)) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[#9A9088] text-xs mb-1">Return</p>
              {loading ? <span className="text-[#9A9088] animate-pulse text-sm">—</span> : <GainBadge pct={gainLossPct} />}
            </div>
            <div>
              <p className="text-[#9A9088] text-xs mb-1">Portfolio %</p>
              <p className="text-[#9A9088] text-sm">{portPct.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">Why I hold this</p>
          <p className="text-[#C8C0B4] text-sm italic">"{h.reason}"</p>
        </div>

        <div className="mt-3">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{ width: `${portPct}%`, background: 'linear-gradient(90deg, #8B6914, #C9A84C)' }} />
          </div>
        </div>

        {isMultiBuy && (
          <button onClick={() => setExpanded(!expanded)}
            className="mt-4 text-xs transition-colors flex items-center gap-1"
            style={{ color: 'rgba(201,168,76,0.7)' }}>
            <span>{expanded ? '▲' : '▼'}</span>
            {expanded ? 'Hide' : 'Show'} buy history ({h.buyHistory.length} transactions)
          </button>
        )}
      </div>

      {isMultiBuy && expanded && (
        <div className="border-t border-white/5 px-5 pb-5">
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mt-4 mb-3">Buy History</p>
          <div className="space-y-2">
            {h.buyHistory.map((buy, i) => (
              <div key={i} className="flex flex-wrap items-start justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-[#C8C0B4] text-sm">
                    {new Date(buy.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}{buy.shares} shares @ {formatPHP(buy.pricePerShare)}
                  </p>
                  <p className="text-[#9A9088] text-xs italic mt-0.5">"{buy.reason}"</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-sm">{formatPHP(buy.totalCost)}</p>
                  <p className="text-[#9A9088] text-xs">fees: {formatPHP(buy.fees)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg"
            style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="text-[#9A9088] text-xs">Blended average cost</p>
            <p className="font-medium" style={{ color: '#C9A84C' }}>
              {formatPHP(h.avgCost)} per share · {h.totalShares} total shares
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Holdings({ holdings }: Props) {
  const [prices, setPrices] = useState<Record<string, number | null>>({})
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const tickers = holdings.map(h => h.ticker)

  // Fetch prices client-side — avoids Vercel IP blocks on Yahoo Finance
  useState(() => {
    async function fetchPrices() {
      const result: Record<string, number | null> = {}
      await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.PS?interval=1d&range=1d`
            const res = await fetch(url)
            if (res.ok) {
              const data = await res.json()
              result[ticker] = data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
            } else {
              result[ticker] = null
            }
          } catch {
            result[ticker] = null
          }
        })
      )
      setPrices(result)
      setUpdatedAt(new Date().toISOString())
      setLoading(false)
    }
    fetchPrices()
  })

  const enrich = (h: MergedHoldingBase) => {
    const currentPrice = prices[h.ticker] ?? null
    const currentValue = currentPrice !== null ? currentPrice * h.totalShares : null
    const gainLoss = currentValue !== null ? currentValue - h.totalCost : null
    const gainLossPct = gainLoss !== null && h.totalCost > 0 ? (gainLoss / h.totalCost) * 100 : null
    return { currentPrice, currentValue, gainLoss, gainLossPct }
  }

  const totalCost = holdings.reduce((s, h) => s + h.totalCost, 0)
  const totalValue = holdings.reduce((s, h) => {
    const { currentValue } = enrich(h)
    return s + (currentValue ?? h.totalCost)
  }, 0)
  const totalGL = totalValue - totalCost
  const totalGLPct = totalCost > 0 ? (totalGL / totalCost) * 100 : 0

  return (
    <section className="px-6 max-w-5xl mx-auto mb-16">
      <div className="flex items-end justify-between mb-6 animate-fade-up stagger-1">
        <div>
          <h2 className="font-display text-3xl text-white font-bold">Holdings</h2>
          <p className="text-[#9A9088] text-sm mt-1">
            {loading ? 'Fetching live prices…' : 'Prices live from PSE · Multiple buys merged automatically'}
          </p>
        </div>
        {updatedAt && (
          <span className="text-[#9A9088] text-xs hidden md:block" suppressHydrationWarning>
            Updated: {new Date(updatedAt).toLocaleTimeString('en-PH')}
          </span>
        )}
      </div>

      <div className="animate-fade-up stagger-2 card p-4 mb-4 flex flex-wrap gap-6">
        <div>
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">Total Cost Basis</p>
          <p className="text-white text-xl font-medium">{formatPHP(totalCost)}</p>
        </div>
        <div>
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">Current Value</p>
          <p className="text-white text-xl font-medium">{loading ? <span className="animate-pulse text-[#9A9088]">—</span> : formatPHP(totalValue)}</p>
        </div>
        <div>
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">Total Gain / Loss</p>
          <p className={`text-xl font-medium ${totalGL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {loading ? <span className="animate-pulse text-[#9A9088]">—</span> : (totalGL >= 0 ? '+' : '') + formatPHP(totalGL)}
          </p>
        </div>
        <div>
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">Overall Return</p>
          {loading ? <span className="animate-pulse text-[#9A9088] text-sm">—</span> : <GainBadge pct={totalGLPct} />}
        </div>
      </div>

      <div className="space-y-3">
        {holdings.map((h, i) => {
          const portPct = totalCost > 0 ? (h.totalCost / totalCost) * 100 : 0
          const { currentPrice, currentValue, gainLoss, gainLossPct } = enrich(h)
          return (
            <div key={h.ticker} className={`animate-fade-up stagger-${Math.min(i + 3, 6)}`}>
              <HoldingCard
                h={h} portPct={portPct}
                currentPrice={currentPrice} currentValue={currentValue}
                gainLoss={gainLoss} gainLossPct={gainLossPct}
                loading={loading}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
