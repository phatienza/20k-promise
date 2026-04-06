import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tickers = searchParams.get('tickers')?.split(',') || []

  if (!tickers.length) {
    return NextResponse.json({ error: 'No tickers provided' }, { status: 400 })
  }

  const prices: Record<string, number | null> = {}

  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        // Yahoo Finance uses .PS suffix for PSE stocks
        const symbol = `${ticker}.PS`
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 900 }, // cache 15 mins
        })
        const data = await res.json()
        const price =
          data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
        prices[ticker] = price
      } catch {
        prices[ticker] = null
      }
    })
  )

  return NextResponse.json({ prices, updatedAt: new Date().toISOString() })
}
