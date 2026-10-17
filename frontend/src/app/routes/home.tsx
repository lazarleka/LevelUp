import { useEffect } from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ActiveFilterChips } from '@/features/games/components/active-filter-chips'
import { GameSearch } from '@/features/games/components/game-search'
import { GameShowcase } from '@/features/games/components/game-showcase'
import { GameSortSelect } from '@/features/games/components/game-sort-select'
import { GamesFilters } from '@/features/games/components/games-filters'
import { GamesGrid } from '@/features/games/components/games-grid'
import { countActiveFilters, useGameFilters } from '@/features/games/hooks/use-game-filters'
import { useCurrentUser } from '@/features/users/api/use-users'

// The shop in one page: best sellers carousel on top, the full catalog with search and filters below.
export function Home() {
  const { filters, setFilters, clearFilters } = useGameFilters()
  const activeCount = countActiveFilters(filters)
  const { data: user } = useCurrentUser()
  const { hash } = useLocation()

  // The header search icon links to /#catalog; jump straight to the catalog.
  useEffect(() => {
    if (hash !== '#catalog') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('catalog')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [hash])

  return (
    <div className="flex flex-col gap-12">
      <h1 className="sr-only">LevelUp: new games for every platform</h1>

      <GameShowcase title="Best sellers" filters={{ sort: 'best-selling' }} />

      <section id="catalog" aria-labelledby="catalog-title" className="flex scroll-mt-4 flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="catalog-title" className="text-2xl font-bold md:text-3xl">
            All games
          </h2>
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
                <Button variant="outline" className="h-10 flex-1 md:flex-none">
                  <SlidersHorizontal />
                  Filters
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Filters</SheetTitle>
                  <SheetDescription>The list updates as you pick.</SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <GamesFilters filters={filters} onChange={setFilters} />
                </div>
                <SheetFooter className="sticky bottom-0 flex-row border-t bg-background">
                  <Button variant="outline" className="h-11 flex-1" onClick={clearFilters} disabled={activeCount === 0}>
                    Clear all
                  </Button>
                  <SheetClose asChild>
                    <Button className="h-11 flex-1">Show games</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <div className="flex-1 md:flex-none">
              <GameSortSelect value={filters.sort ?? 'newest'} onChange={(sort) => setFilters({ sort })} />
            </div>
          </div>
        </div>

        <ActiveFilterChips filters={filters} onChange={setFilters} onClear={clearFilters} />

        <GamesGrid filters={filters} onClearFilters={clearFilters} />
      </section>
    </div>
  )
}
