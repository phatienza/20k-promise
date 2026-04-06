import portfolioData from '../../data/portfolio.json'
import { PortfolioData, EnrichedMergedHolding } from '@/lib/types'
import { mergeHoldings } from '@/lib/mergeHoldings'
import Hero from '@/components/Hero'
import Holdings from '@/components/Holdings'
import MonthlyLogSection from '@/components/MonthlyLogSection'
import Footer from '@/components/Footer'

const data = portfolioData as PortfolioData

async function getLivePrices(tickers: string[]) {
  const prices: Record<string, number | null> = {}

  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        // Try PSE Edge first
        const pseUrl = `https://edge.pse.com.ph/ajax/getQuote?symbol=${ticker}`
        const res = await fetch(pseUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://edge.pse.com.ph/',
            'X-Requested-With': 'XMLHttpRequest',
          },
          next: { revalidate: 900 },
        })
        if (res.ok) {
          const data = await res.json()
          const price = parseFloat(data?.price ?? data?.lastPrice ?? data?.close ?? '0')
          if (price > 0) { prices[ticker] = price; return }
        }
      } catch { /* fall through */ }

      try {
        // Fallback: Yahoo Finance with cookie header
        const yahooUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}.PS?interval=1d&range=1d`
        const res = await fetch(yahooUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          next: { revalidate: 900 },
        })
        if (res.ok) {
          const data = await res.json()
          const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
          if (price) { prices[ticker] = price; return }
        }
      } catch { /* fall through */ }

      prices[ticker] = null
    })
  )

  return { prices, updatedAt: new Date().toISOString() }
}

export default async function Home() {
  const merged = mergeHoldings(data.holdings)
  const tickers = [...new Set(merged.map((h) => h.ticker))]
  const priceData = await getLivePrices(tickers)

  const enrichedHoldings: EnrichedMergedHolding[] = merged.map((h) => {
    const currentPrice: number | null = priceData?.prices?.[h.ticker] ?? null
    const currentValue = currentPrice !== null ? currentPrice * h.totalShares : null
    const gainLoss = currentValue !== null ? currentValue - h.totalCost : null
    const gainLossPct = gainLoss !== null && h.totalCost > 0 ? (gainLoss / h.totalCost) * 100 : null
    return { ...h, currentPrice, currentValue, gainLoss, gainLossPct }
  })

  const totalInvested = merged.reduce((s, h) => s + h.totalCost, 0)

  return (
    <main>
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />
      <Hero meta={data.meta} monthlyLog={data.monthlyLog} totalInvested={totalInvested} />
      <div className="gold-line max-w-5xl mx-auto mb-12 px-6" />
      <Holdings holdings={enrichedHoldings} updatedAt={priceData?.updatedAt ?? null} />
      <div className="gold-line max-w-5xl mx-auto mb-12 px-6" />
      <MonthlyLogSection logs={data.monthlyLog} monthlyCommitment={data.meta.monthlyCommitment} />
      <Footer />
    </main>
  )
}
