import portfolioData from '../../data/portfolio.json'
import { PortfolioData, EnrichedMergedHolding } from '@/lib/types'
import { mergeHoldings } from '@/lib/mergeHoldings'
import Hero from '@/components/Hero'
import Holdings from '@/components/Holdings'
import MonthlyLogSection from '@/components/MonthlyLogSection'
import Footer from '@/components/Footer'

const data = portfolioData as PortfolioData
export const revalidate = 900 // 15 minutes

async function getLivePrices(tickers: string[]) {
  try {
    const prices: Record<string, number | null> = {}
    await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const res = await fetch(
            `https://pselookup.vrymel.com/api/stocks/${ticker}`,
            { cache: 'force-cache' } 
          )
          if (res.ok) {
            const data = await res.json()
            const price = data?.stock?.[0]?.price?.amount ?? null
            if (price) { prices[ticker] = parseFloat(price); return }
          }
        } catch { /* fall through */ }

        try {
          const res2 = await fetch(
            `https://phisix-api4.appspot.com/stocks/${ticker}.json`,
            { cache: 'force-cache' } 
          )
          if (res2.ok) {
            const data2 = await res2.json()
            const price2 = data2?.stock?.[0]?.price?.amount ?? null
            prices[ticker] = price2 ? parseFloat(price2) : null
          } else {
            prices[ticker] = null
          }
        } catch {
          prices[ticker] = null
        }
      })
    )
    return { prices, updatedAt: new Date().toISOString() }
  } catch {
    return null
  }
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
