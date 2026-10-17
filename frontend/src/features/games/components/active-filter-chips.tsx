import { X } from 'lucide-react'

import { genreLabels, platformLabels } from '../types'
import type { GameFilters } from '../types'

type ActiveFilterChipsProps = {
  filters: GameFilters
  onChange: (changes: Partial<GameFilters>) => void
  onClear: () => void
}

type Chip = { label: string; remove: Partial<GameFilters> }

function chipsFor(filters: GameFilters): Chip[] {
  const chips: Chip[] = []
  if (filters.search) chips.push({ label: `“${filters.search}”`, remove: { search: undefined } })
  if (filters.platform) chips.push({ label: platformLabels[filters.platform], remove: { platform: undefined } })
  if (filters.genre) chips.push({ label: genreLabels[filters.genre], remove: { genre: undefined } })
  if (filters.minPrice !== undefined) chips.push({ label: `From €${filters.minPrice}`, remove: { minPrice: undefined } })
  if (filters.maxPrice !== undefined) chips.push({ label: `Up to €${filters.maxPrice}`, remove: { maxPrice: undefined } })
  if (filters.maxPegi) chips.push({ label: `PEGI ${filters.maxPegi} and under`, remove: { maxPegi: undefined } })
  if (filters.onSale) chips.push({ label: 'On sale', remove: { onSale: undefined } })
  if (filters.comingSoon) chips.push({ label: 'Coming soon', remove: { comingSoon: undefined } })
  return chips
}

// Active filters above the grid; each chip removes its own filter.
export function ActiveFilterChips({ filters, onChange, onClear }: ActiveFilterChipsProps) {
  const chips = chipsFor(filters)
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => onChange(chip.remove)}
          aria-label={`Remove filter ${chip.label}`}
          className="flex items-center gap-1 rounded-full bg-secondary py-1 pr-2 pl-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {chip.label}
          <X className="size-4" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="px-2 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
