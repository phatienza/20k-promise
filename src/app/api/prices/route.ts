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
        // PSE Lookup — free, no API key, dedicated Philippine stocks API
        const res = await fetch(
          `https://pselookup.vrymel.com/api/stocks/${ticker}`,
          { next: { revalidate: 900 } }
        )
        if (res.ok) {
          const data = await res.json()
          const price = data?.stock?.[0]?.price?.amount ?? null
          if (price) { prices[ticker] = parseFloat(price); return }
        }
      } catch { /* fall through */ }

      // Fallback: phisix-api (another free PH stocks API)
      try {
        const res2 = await fetch(
          `https://phisix-api4.appspot.com/stocks/${ticker}.json`,
          { next: { revalidate: 900 } }
        )
        if (res2.ok) {
          const data2 = await res2.json()
          const price2 = data2?.stock?.[0]?.price?.amount ?? null
          if (price2) { prices[ticker] = parseFloat(price2); return }
        }
      } catch { /* fall through */ }

      prices[ticker] = null
    })
  )

  return NextResponse.json({ prices, updatedAt: new Date().toISOString() })
}
