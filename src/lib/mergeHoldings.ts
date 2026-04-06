import { Holding } from './types'

export interface MergedHolding {
  ticker: string
  name: string
  exchange: string
  totalShares: number
  avgCost: number        // blended average cost per share
  totalCost: number      // total amount invested across all buys
  totalFees: number
  firstBought: string
  lastBought: string
  reason: string         // from the most recent buy
  buyHistory: {
    date: string
    shares: number
    pricePerShare: number
    totalCost: number
    fees: number
    reason: string
  }[]
}

/**
 * Groups multiple buy entries for the same ticker into one merged holding.
 * Calculates blended average cost (WAVG) across all buys.
 */
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
        buyHistory: [],
      })
    }

    const existing = map.get(h.ticker)!

    // Accumulate
    existing.totalShares += h.shares
    existing.totalCost += h.totalCost
    existing.totalFees += h.fees

    // Blended average = total cost / total shares
    existing.avgCost = existing.totalCost / existing.totalShares

    // Track date range
    if (h.dateBought < existing.firstBought) existing.firstBought = h.dateBought
    if (h.dateBought > existing.lastBought) {
      existing.lastBought = h.dateBought
      existing.reason = h.reason // latest reason wins
    }

    // Push to history
    existing.buyHistory.push({
      date: h.dateBought,
      shares: h.shares,
      pricePerShare: h.avgCost,
      totalCost: h.totalCost,
      fees: h.fees,
      reason: h.reason,
    })
  }

  // Sort buy history by date ascending
  for (const merged of map.values()) {
    merged.buyHistory.sort((a, b) => a.date.localeCompare(b.date))
  }

  return Array.from(map.values())
}