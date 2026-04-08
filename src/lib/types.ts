export interface Holding {
  ticker: string
  name: string
  exchange: string
  shares: number
  avgCost: number
  totalCost: number
  fees: number
  dateBought: string
  currentPrice?: number
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
  lastUpdated?: string
  social?: {
    facebook?: string
    threads?: string
    instagram?: string
  }
}

export interface PortfolioData {
  meta: PortfolioMeta
  holdings: Holding[]
  monthlyLog: MonthlyLog[]
}
