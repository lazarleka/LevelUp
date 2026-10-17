import { Plus, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ActiveFilterChips } from '@/features/games/components/active-filter-chips'
import { GameSearch } from '@/features/games/components/game-search'
import { GameSortSelect } from '@/features/games/components/game-sort-select'
import { GamesFilters } from '@/features/games/components/games-filters'
import { GamesGrid } from '@/features/games/components/games-grid'
import { countActiveFilters, useGameFilters } from '@/features/games/hooks/use-game-filters'
import { useCurrentUser } from '@/features/users/api/use-users'

export function Games() {
  const { filters, setFilters, clearFilters } = useGameFilters()
  const activeCount = countActiveFilters(filters)
  const { data: user } = useCurrentUser()

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">All games</h1>
        {user?.role === 'admin' && (
          <Button asChild variant="outline">
            <Link to="/admin/games/new">
              <Plus />
              Add game
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:max-w-md md:flex-1">
          <GameSearch value={filters.search ?? ''} onChange={(search) => setFilters({ search })} />
        </div>
        <div className="flex gap-3 md:ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 flex-1 lg:hidden">
                <SlidersHorizontal />
                Filters{activeCount > 0 && ` (${activeCount})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <GamesFilters filters={filters} onChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <GameSortSelect value={filters.sort ?? 'newest'} onChange={(sort) => setFilters({ sort })} />
          </div>
        </div>
      </div>

      <ActiveFilterChips filters={filters} onChange={setFilters} onClear={clearFilters} />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <GamesFilters filters={filters} onChange={setFilters} />
        </aside>
        <GamesGrid filters={filters} onClearFilters={clearFilters} />
      </div>
    </section>
  )
}
