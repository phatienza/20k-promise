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
        // PSE Edge official API
        const url = `https://edge.pse.com.ph/ajax/getQuote?symbol=${ticker}`
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://edge.pse.com.ph/',
            'X-Requested-With': 'XMLHttpRequest',
          },
          next: { revalidate: 900 },
        })
        const data = await res.json()
        const price = parseFloat(data?.price ?? data?.lastPrice ?? data?.close ?? '0')
        prices[ticker] = price > 0 ? price : null
      } catch {
        // Fallback: try PhilStocks
        try {
          const url2 = `https://www.philstocks.ph/quote/${ticker}.json`
          const res2 = await fetch(url2, { next: { revalidate: 900 } })
          const data2 = await res2.json()
          const price2 = parseFloat(data2?.last ?? '0')
          prices[ticker] = price2 > 0 ? price2 : null
        } catch {
          prices[ticker] = null
        }
      }
    })
  )

  return NextResponse.json({ prices, updatedAt: new Date().toISOString() })
}
