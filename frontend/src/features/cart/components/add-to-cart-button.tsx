import { useEffect, useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useAddToCart } from '../api/use-cart'
import type { NewCartItem } from '../types'

type AddToCartButtonProps = {
  item: NewCartItem
  /** Signed-out users are sent to sign in instead of adding */
  signedIn: boolean
  onSignInRequired: () => void
  disabled?: boolean
  label?: string
}

// The main action on the game page. Shows "Added" for a moment after a successful add.
export function AddToCartButton({ item, signedIn, onSignInRequired, disabled, label = 'Add to cart' }: AddToCartButtonProps) {
  const addToCart = useAddToCart()
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const timer = setTimeout(() => setJustAdded(false), 2000)
    return () => clearTimeout(timer)
  }, [justAdded])

  const onClick = () => {
    if (!signedIn) return onSignInRequired()
    addToCart.mutate(item, { onSuccess: () => setJustAdded(true) })
  }

  return (
    <div className="flex flex-col gap-2 md:items-start">
      <Button size="lg" className="h-12 w-full text-base md:w-auto md:px-10" disabled={disabled || addToCart.isPending} onClick={onClick}>
        {justAdded ? <Check className="size-5" /> : <ShoppingCart className="size-5" />}
        {addToCart.isPending ? 'Adding…' : justAdded ? 'Added to cart' : label}
      </Button>
      <p aria-live="polite" className="sr-only">
        {justAdded ? `${item.title} added to cart` : ''}
      </p>
      {addToCart.error && <p className="text-sm text-destructive">Could not add to cart. Please try again.</p>}
    </div>
  )
}
