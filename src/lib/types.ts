export interface Holding {
  ticker: string
  name: string
  exchange: string
  shares: number
  avgCost: number
  totalCost: number
  fees: number
  dateBought: string
  reason: string
}

export interface MonthlyLog {
  month: string
  label: string
  deposited: number
  breakdown: Record<string, number>
  notes: string
}

export interface PortfolioMeta {
  pageTitle: string
  tagline: string
  goal: number
  monthlyCommitment: number
  startDate: string
  currency: string
}

export interface PortfolioData {
  meta: PortfolioMeta
  holdings: Holding[]
  monthlyLog: MonthlyLog[]
}

export interface LivePrices {
  prices: Record<string, number | null>
  updatedAt: string
}

export interface EnrichedHolding extends Holding {
  currentPrice: number | null
  currentValue: number | null
  gainLoss: number | null
  gainLossPct: number | null
}
