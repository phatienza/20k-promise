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
        const symbol = `${ticker}.PS`
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 900 },
        })
        const data = await res.json()
        prices[ticker] = data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
      } catch {
        prices[ticker] = null
      }
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