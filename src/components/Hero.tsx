'use client'
import { PortfolioMeta, MonthlyLog } from '@/lib/types'

interface Props {
  meta: PortfolioMeta
  monthlyLog: MonthlyLog[]
  totalInvested: number
}

function formatPHP(n: number) {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function Hero({ meta, monthlyLog, totalInvested }: Props) {
  const progress = (totalInvested / meta.goal) * 100
  const monthsIn = monthlyLog.length
  const monthsNeeded = Math.ceil((meta.goal - totalInvested) / meta.monthlyCommitment)

  return (
    <section className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto">

      {/* Logo + label row */}
      <div className="animate-fade-up stagger-1 flex items-center gap-4 mb-8">
        <img
          src="/logo.png"
          alt="The 20K Promise"
          className="w-10 h-10 rounded-lg"
          style={{ border: '1px solid rgba(201,168,76,0.3)' }}
        />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
          <span className="text-gold text-xs tracking-[0.2em] uppercase font-medium">
            Live Portfolio
          </span>
        </div>
      </div>

      {/* Main title */}
      <h1 className="font-display animate-fade-up stagger-2 text-5xl md:text-7xl font-black text-white leading-[1.05] mb-4">
        The 20K<br />
        <span className="text-gold">Promise.</span>
      </h1>

      <p className="animate-fade-up stagger-3 text-[#9A9088] text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
        A Filipino investor. ₱20,000 every month. Building toward{' '}
        <span className="text-white">₱2,000,000</span>.{' '}
        Real stocks. Real numbers. No filters.
      </p>

      <div className="gold-line mb-12 animate-fade-up stagger-3" />

      {/* Stats row */}
      <div className="animate-fade-up stagger-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Invested', value: formatPHP(totalInvested) },
          { label: 'Monthly Commitment', value: formatPHP(meta.monthlyCommitment) },
          { label: 'Months In', value: `${monthsIn}` },
          { label: 'Est. Months to Goal', value: `${monthsNeeded}` },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-1">{stat.label}</p>
            <p className="font-display text-2xl md:text-3xl text-white font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Goal progress bar */}
      <div className="animate-fade-up stagger-5">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[#9A9088] text-sm tracking-wide">Progress to {formatPHP(meta.goal)}</span>
          <span className="text-gold font-medium text-sm">{progress.toFixed(2)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #8B6914, #C9A84C, #F0CC7A)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[#9A9088] text-xs">₱0</span>
          <span className="text-[#9A9088] text-xs">₱2,000,000</span>
        </div>
      </div>

    </section>
  )
}
