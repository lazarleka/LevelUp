import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { genreLabels, genres, pegiRatings, platformLabels, platforms } from '../types'
import type { GameFilters, Pegi } from '../types'

type GamesFiltersProps = {
  filters: GameFilters
  onChange: (changes: Partial<GameFilters>) => void
}

const optionClass = (selected: boolean) =>
  cn(
    'rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    selected ? 'border-secondary bg-secondary text-secondary-foreground' : 'hover:bg-accent',
  )

const toPrice = (value: string) => (value === '' ? undefined : Math.max(0, Number(value)))

// Catalog filters. Every change is applied at once, there is no "Apply" button.
export function GamesFilters({ filters, onChange }: GamesFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Platform</legend>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => {
            const selected = filters.platform === platform
            return (
              <button
                key={platform}
                type="button"
                aria-pressed={selected}
                className={optionClass(selected)}
                onClick={() => onChange({ platform: selected ? undefined : platform })}
              >
                {platformLabels[platform]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Genre</legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const selected = filters.genre === genre
            return (
              <button
                key={genre}
                type="button"
                aria-pressed={selected}
                className={optionClass(selected)}
                onClick={() => onChange({ genre: selected ? undefined : genre })}
              >
                {genreLabels[genre]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Price (€)</legend>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            aria-label="Minimum price"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => onChange({ minPrice: toPrice(e.target.value) })}
          />
          <span aria-hidden="true">–</span>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            aria-label="Maximum price"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onChange({ maxPrice: toPrice(e.target.value) })}
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="max-pegi" className="text-sm font-semibold">
          Age rating
        </Label>
        <Select
          value={filters.maxPegi ? String(filters.maxPegi) : 'any'}
          onValueChange={(value) =>
            onChange({ maxPegi: value === 'any' ? undefined : (Number(value) as Pegi) })
          }
        >
          <SelectTrigger id="max-pegi" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any age</SelectItem>
            {pegiRatings.map((pegi) => (
              <SelectItem key={pegi} value={String(pegi)}>
                PEGI {pegi} and under
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="on-sale"
            checked={filters.onSale ?? false}
            onCheckedChange={(checked) => onChange({ onSale: checked === true || undefined })}
          />
          <Label htmlFor="on-sale">On sale only</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="coming-soon"
            checked={filters.comingSoon ?? false}
            onCheckedChange={(checked) => onChange({ comingSoon: checked === true || undefined })}
          />
          <Label htmlFor="coming-soon">Coming soon (pre-order)</Label>
        </div>
      </div>
    </div>
  )
}
