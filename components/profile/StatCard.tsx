interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: 'amber' | 'stone' | 'blue' | 'orange'
}

const colorClasses = {
  amber: 'from-amber-400 to-amber-600',
  stone: 'from-stone-400 to-stone-600',
  blue: 'from-blue-400 to-blue-600',
  orange: 'from-orange-400 to-orange-600',
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-gradient-to-br ${colorClasses[color]} dark:from-violet-600 dark:to-indigo-600 rounded-lg text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold text-stone-800 dark:text-violet-100">{value}</p>
          <p className="text-xs text-stone-400 dark:text-violet-300/50 mt-1">{label}</p>
        </div>
      </div>
    </div>
  )
}
