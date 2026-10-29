import { LogOut, User as UserIcon } from 'lucide-react'
import { Link } from 'react-router'

import { useCurrentUser, useSignOut } from '../api/use-users'

const iconLinkClass =
  'flex h-10 items-center gap-2 rounded-md px-2 hover:bg-brand-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'

// Header item: "Sign in" when signed out, a sign out button when signed in.
export function UserMenu() {
  const { data: user } = useCurrentUser()
  const signOut = useSignOut()

  if (!user) {
    return (
      <Link to="/sign-in" aria-label="Sign in" className={iconLinkClass}>
        <UserIcon className="size-5" />
        <span className="hidden text-sm font-medium md:inline">Sign in</span>
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => signOut.mutate()}
      aria-label={`Sign out ${user.name}`}
      title={`Signed in as ${user.name}`}
      className={iconLinkClass}
    >
      <LogOut className="size-5" />
    </button>
  )
}
