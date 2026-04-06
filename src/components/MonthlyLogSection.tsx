'use client'
import { MonthlyLog } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  logs: MonthlyLog[]
  monthlyCommitment: number
}

function formatPHP(n: number) {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1F3C] border border-gold/20 rounded-lg p-3 text-sm">
        <p className="text-gold font-medium mb-1">{label}</p>
        <p className="text-white">{formatPHP(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function MonthlyLogSection({ logs, monthlyCommitment }: Props) {
  const cumulative = logs.reduce<{ label: string; amount: number; cumulative: number }[]>((acc, log, i) => {
    const prev = acc[i - 1]?.cumulative ?? 0
    acc.push({ label: log.label.replace(' 20', " '"), amount: log.deposited, cumulative: prev + log.deposited })
    return acc
  }, [])

  const totalDeposited = cumulative[cumulative.length - 1]?.cumulative ?? 0

  return (
    <section className="px-6 max-w-5xl mx-auto mb-16">

      <div className="mb-6 animate-fade-up stagger-1">
        <h2 className="font-display text-3xl text-white font-bold">Monthly Log</h2>
        <p className="text-[#9A9088] text-sm mt-1">
          {formatPHP(monthlyCommitment)} committed every month — tracked here publicly
        </p>
      </div>

      {/* Chart */}
      {cumulative.length > 0 && (
        <div className="animate-fade-up stagger-2 card p-6 mb-6">
          <p className="text-[#9A9088] text-xs tracking-widest uppercase mb-4">Cumulative Invested</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cumulative} barSize={32}>
              <XAxis dataKey="label" tick={{ fill: '#9A9088', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                tick={{ fill: '#9A9088', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)' }} />
              <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                {cumulative.map((_, i) => (
                  <Cell key={i} fill={i === cumulative.length - 1 ? '#C9A84C' : '#C9A84C60'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log entries */}
      <div className="space-y-3">
        {[...logs].reverse().map((log, i) => (
          <div key={log.month} className={`card card-hover p-5 animate-fade-up stagger-${Math.min(i + 3, 6)}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-white font-medium">{log.label}</p>
                <p className="text-[#9A9088] text-sm mt-0.5 italic">"{log.notes}"</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gold font-display text-xl font-bold">{formatPHP(log.deposited)}</p>
                <p className={`text-xs mt-1 ${log.deposited >= monthlyCommitment ? 'text-green-400' : 'text-red-400'}`}>
                  {log.deposited >= monthlyCommitment ? '✓ Goal met' : `₱${(monthlyCommitment - log.deposited).toLocaleString()} short`}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(log.breakdown).map(([ticker, amt]) => (
                <span
                  key={ticker}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  {ticker}: {formatPHP(amt)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
