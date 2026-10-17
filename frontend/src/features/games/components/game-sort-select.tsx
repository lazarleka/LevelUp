import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { sortLabels } from '../types'
import type { GameSort } from '../types'

type GameSortSelectProps = {
  value: GameSort
  onChange: (sort: GameSort) => void
}

const sorts = Object.keys(sortLabels) as GameSort[]

export function GameSortSelect({ value, onChange }: GameSortSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as GameSort)}>
      <SelectTrigger aria-label="Sort games" className="w-full md:w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sorts.map((sort) => (
          <SelectItem key={sort} value={sort}>
            {sortLabels[sort]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
