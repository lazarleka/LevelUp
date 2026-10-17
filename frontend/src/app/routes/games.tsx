import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { GamesGrid } from '@/features/games/components/games-grid'

export function Games() {
  const [search, setSearch] = useState('')

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-3xl font-bold">All games</h1>
        <Input
          aria-label="Search games"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-xs"
        />
      </div>

      <GamesGrid filters={{ search }} />
    </section>
  )
}
