'use client'
import { useEffect, useState } from 'react'

interface Props {
  tickers: string[]
  onPrices: (prices: Record<string, number | null>, updatedAt: string) => void
}

export default function PriceFetcher({ tickers, onPrices }: Props) {
  useEffect(() => {
    async function fetchPrices() {
      const prices: Record<string, number | null> = {}

      await Promise.all(
        tickers.map(async (ticker) => {
          try {
            // Called from browser — not blocked by Vercel IP issues
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.PS?interval=1d&range=1d`
            const res = await fetch(url)
            if (res.ok) {
              const data = await res.json()
              const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
              prices[ticker] = price
            } else {
              prices[ticker] = null
            }
          } catch {
            prices[ticker] = null
          }
        })
      )

      onPrices(prices, new Date().toISOString())
    }

    fetchPrices()
  }, [tickers.join(',')])

  return null
}
