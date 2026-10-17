import { useEffect, useRef, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'

import { useCart } from '../api/use-cart'
import { cartCount } from '../types'

// Cart icon for the header, with the number of items in a yellow badge that bounces when it grows.
export function CartButton() {
  const { data: items } = useCart()
  const count = items ? cartCount(items) : 0
  const previous = useRef(count)
  const [bounces, setBounces] = useState(0)

  useEffect(() => {
    if (count > previous.current) setBounces((n) => n + 1)
    previous.current = count
  }, [count])

  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="relative flex size-10 items-center justify-center rounded-md hover:bg-brand-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span
          // A new key restarts the animation on every added item.
          key={bounces}
          className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground animate-cart-bounce motion-reduce:animate-none"
        >
          {count}
        </span>
      )}
    </Link>
  )
}
