import { Navigate, useNavigate, useSearchParams } from 'react-router'

import { useCurrentUser } from '@/features/users/api/use-users'
import { SignInForm } from '@/features/users/components/sign-in-form'

// Only same-site paths are allowed as a redirect target.
const safeRedirect = (value: string | null) => (value?.startsWith('/') && !value.startsWith('//') ? value : '/')

export function SignIn() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const redirect = safeRedirect(params.get('redirect'))

  if (user) return <Navigate to={redirect} replace />

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Demo accounts: ana.radovic@gmail.com (customer) or marko@levelup.me (admin), any password of 6+
          characters.
        </p>
      </div>
      <SignInForm onSignedIn={() => navigate(redirect, { replace: true })} />
    </section>
  )
}
