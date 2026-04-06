import portfolioData from '../../data/portfolio.json'
import { PortfolioData, EnrichedMergedHolding } from '@/lib/types'
import { mergeHoldings } from '@/lib/mergeHoldings'
import Hero from '@/components/Hero'
import Holdings from '@/components/Holdings'
import MonthlyLogSection from '@/components/MonthlyLogSection'
import Footer from '@/components/Footer'

const data = portfolioData as PortfolioData

async function getLivePrices(tickers: string[]) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(
      `${baseUrl}/api/prices?tickers=${tickers.join(',')}`,
      { next: { revalidate: 900 } }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function Home() {
  // Merge multiple buys of same ticker into one blended position
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
      {/* Background glow */}
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