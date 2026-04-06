import portfolioData from '../../data/portfolio.json'
import { PortfolioData } from '@/lib/types'
import { mergeHoldings } from '@/lib/mergeHoldings'
import Hero from '@/components/Hero'
import Holdings from '@/components/Holdings'
import MonthlyLogSection from '@/components/MonthlyLogSection'
import Footer from '@/components/Footer'

const data = portfolioData as PortfolioData

export default function Home() {
  const merged = mergeHoldings(data.holdings)
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
      <Holdings holdings={merged} />
      <div className="gold-line max-w-5xl mx-auto mb-12 px-6" />
      <MonthlyLogSection logs={data.monthlyLog} monthlyCommitment={data.meta.monthlyCommitment} />
      <Footer />
    </main>
  )
}
