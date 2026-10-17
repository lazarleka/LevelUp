import { Navigate, useLocation } from 'react-router'

// The catalog now lives on the home page; old /games links keep their filters.
export function Games() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/', search, hash: '#catalog' }} replace />
}
