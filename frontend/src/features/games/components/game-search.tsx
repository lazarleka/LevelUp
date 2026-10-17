import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { useGames } from '../api/use-games'
import { finalPrice } from '../types'

type GameSearchProps = {
  value: string
  onChange: (value: string) => void
}

const MIN_CHARS = 2
const MAX_SUGGESTIONS = 5

// Search by name with up to five suggestions while typing. Arrow keys move, Enter opens a game.
export function GameSearch({ value, onChange }: GameSearchProps) {
  const listId = useId()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const query = value.trim()
  const { data } = useGames({ search: query, sort: 'best-selling' }, { enabled: query.length >= MIN_CHARS })
  const suggestions = query.length >= MIN_CHARS ? (data ?? []).slice(0, MAX_SUGGESTIONS) : []
  const showList = open && suggestions.length > 0

  const openGame = (id: number) => {
    setOpen(false)
    navigate(`/games/${id}`)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (event.key === 'Enter') {
      const game = suggestions[active]
      if (!game) return
      event.preventDefault()
      openGame(game.id)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        role="combobox"
        aria-label="Search games by name"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        placeholder="Search by name"
        className="h-10 pl-9"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          // Keep focus in the input so a click on a suggestion is not lost to blur.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-md border bg-popover shadow-lg"
        >
          {suggestions.map((game, index) => (
            <li
              key={game.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onClick={() => openGame(game.id)}
              onMouseEnter={() => setActive(index)}
              className={cn('flex cursor-pointer items-center gap-3 px-3 py-2', index === active && 'bg-accent')}
            >
              <img src={game.coverUrl} alt="" className="aspect-[3/4] w-8 rounded-sm object-cover" />
              <span className="flex-1 truncate text-sm font-medium">{game.title}</span>
              <span className="font-heading text-sm font-bold">
                €{finalPrice(game.price, game.discountPercent).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
