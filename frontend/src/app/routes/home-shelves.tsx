import { GameCarousel } from '@/features/games/components/game-carousel'

// The three home carousels from SPEC.md, shared by all home variants.
export function HomeShelves() {
  return (
    <div className="flex flex-col gap-12">
      <GameCarousel title="New" filters={{ sort: 'newest' }} seeAllTo="/games?sort=newest" />
      <GameCarousel title="Best sellers" filters={{ sort: 'best-selling' }} seeAllTo="/games?sort=best-selling" />
      <GameCarousel title="On sale" filters={{ onSale: true, sort: 'best-selling' }} seeAllTo="/games?onSale=true" />
    </div>
  )
}
