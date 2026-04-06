import portfolioData from '../../data/portfolio.json'
import { PortfolioData } from '@/lib/types'
import { mergeHoldings, MergedHolding } from '@/lib/mergeHoldings'
import Hero from '@/components/Hero'
import Holdings from '@/components/Holdings'
import MonthlyLogSection from '@/components/MonthlyLogSection'
import Footer from '@/components/Footer'

const data = portfolioData as PortfolioData

export interface EnrichedHolding extends MergedHolding {
  currentPrice: number | undefined
  currentValue: number | undefined
  gainLoss: number | undefined
  gainLossPct: number | undefined
}

export default function Home() {
  const merged = mergeHoldings(data.holdings)

  const enrichedHoldings: EnrichedHolding[] = merged.map((h) => {
    const currentPrice = h.currentPrice ?? undefined
    const currentValue = currentPrice !== undefined ? currentPrice * h.totalShares : undefined
    const gainLoss = currentValue !== undefined ? currentValue - h.totalCost : undefined
    const gainLossPct = gainLoss !== undefined && h.totalCost > 0 ? (gainLoss / h.totalCost) * 100 : undefined
    return { ...h, currentPrice, currentValue, gainLoss, gainLossPct }
  })

  const totalInvested = merged.reduce((s, h) => s + h.totalCost, 0)
  const lastUpdated = data.meta.lastUpdated ?? null

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
      <Holdings holdings={enrichedHoldings} updatedAt={lastUpdated} />
      <div className="gold-line max-w-5xl mx-auto mb-12 px-6" />
      <MonthlyLogSection logs={data.monthlyLog} monthlyCommitment={data.meta.monthlyCommitment} />
      <Footer />
    </main>
  )
}