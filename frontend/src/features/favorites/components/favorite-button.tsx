import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useFavorites, useSetFavorite } from '../api/use-favorites'

type FavoriteButtonProps = {
  userId: number | null
  gameId: number
  title: string
  onSignInRequired: () => void
  className?: string
  disabled?: boolean
}

export function FavoriteButton({
  userId,
  gameId,
  title,
  onSignInRequired,
  className,
  disabled,
}: FavoriteButtonProps) {
  const favorites = useFavorites(userId)
  const update = useSetFavorite(userId)
  const saved = favorites.data?.some((item) => item.gameId === gameId) ?? false
  const label = `${saved ? 'Remove' : 'Add'} ${title} ${saved ? 'from' : 'to'} favorites`

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        title={label}
        aria-pressed={saved}
        disabled={disabled || update.isPending || (userId !== null && favorites.isLoading)}
        onClick={() => {
          if (userId === null) return onSignInRequired()
          if (favorites.error) {
            void favorites.refetch()
            return
          }
          update.mutate({ gameId, saved: !saved })
        }}
        className={cn(
          'flex size-9 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50',
          saved && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
          className,
        )}
      >
        <Heart className={cn('size-4', saved && 'fill-current')} />
      </button>
      <span role="status" className="sr-only">
        {update.isSuccess ? `${title} ${saved ? 'saved to' : 'removed from'} favorites` : ''}
      </span>
      {(update.error || favorites.error) && (
        <p
          role="alert"
          className="absolute top-full right-0 z-10 mt-2 w-44 rounded-md border bg-card p-2 text-xs text-destructive shadow-sm"
        >
          Favorites could not be {favorites.error ? 'loaded' : 'saved'}. Please try again.
        </p>
      )}
    </div>
  )
}
