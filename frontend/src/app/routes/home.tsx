import { HomeShelves } from '@/app/routes/home-shelves'

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold md:text-4xl">New games for every platform</h1>
      <HomeShelves />
    </div>
  )
}
