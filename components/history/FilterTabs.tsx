interface FilterTabsProps {
  currentFilter: 'all' | 'completed' | 'draft'
  onFilterChange: (filter: 'all' | 'completed' | 'draft') => void
}

export function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { value: 'all' as const, label: '全部' },
    { value: 'completed' as const, label: '已完成' },
    { value: 'draft' as const, label: '草稿' },
  ]

  return (
    <div className="inline-flex bg-white dark:bg-[#1a1625] rounded-full p-1 shadow-sm border border-stone-200 dark:border-violet-900/30">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            currentFilter === filter.value
              ? 'bg-stone-800 dark:bg-violet-600 text-white'
              : 'text-stone-600 dark:text-violet-300/70 hover:text-stone-800 dark:hover:text-violet-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
