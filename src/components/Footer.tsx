export default function Footer() {
  return (
    <footer className="px-6 max-w-5xl mx-auto pb-12">
      <div className="gold-line mb-8" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-display text-white font-bold text-lg">The 20K Promise</p>
          <p className="text-[#9A9088] text-sm mt-1">Transparency in every peso.</p>
        </div>
        <div className="text-right">
          <p className="text-[#9A9088] text-xs leading-relaxed max-w-sm">
            This is not financial advice. This is one person's public commitment to build wealth — documented honestly, wins and losses included.
          </p>
        </div>
      </div>
    </footer>
  )
}
