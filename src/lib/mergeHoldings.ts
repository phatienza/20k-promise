import { Holding } from './types'

export interface MergedHolding {
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
  currentPrice?: number
  buyHistory: {
    date: string
    shares: number
    pricePerShare: number
    totalCost: number
    fees: number
    reason: string
  }[]
}

export function mergeHoldings(holdings: Holding[]): MergedHolding[] {
  const map = new Map<string, MergedHolding>()

  for (const h of holdings) {
    if (!map.has(h.ticker)) {
      map.set(h.ticker, {
        ticker: h.ticker,
        name: h.name,
        exchange: h.exchange,
        totalShares: 0,
        avgCost: 0,
        totalCost: 0,
        totalFees: 0,
        firstBought: h.dateBought,
        lastBought: h.dateBought,
        reason: h.reason,
        currentPrice: h.currentPrice,
        buyHistory: [],
      })
    }

    const existing = map.get(h.ticker)!
    existing.totalShares += h.shares
    existing.totalCost += h.totalCost
    existing.totalFees += h.fees
    existing.avgCost = existing.totalCost / existing.totalShares

    if (h.dateBought < existing.firstBought) existing.firstBought = h.dateBought
    if (h.dateBought > existing.lastBought) {
      existing.lastBought = h.dateBought
      existing.reason = h.reason
      // Use most recent currentPrice
      if (h.currentPrice) existing.currentPrice = h.currentPrice
    }

    existing.buyHistory.push({
      date: h.dateBought,
      shares: h.shares,
      pricePerShare: h.avgCost,
      totalCost: h.totalCost,
      fees: h.fees,
      reason: h.reason,
    })
  }

  for (const merged of map.values()) {
    merged.buyHistory.sort((a, b) => a.date.localeCompare(b.date))
  }

  return Array.from(map.values())
}
