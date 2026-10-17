import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { genreLabels, genres, pegiRatings, platformLabels, platforms } from '../types'
import type { NewGame } from '../types'

const gameSchema = z
  .object({
    title: z.string().trim().min(2, 'At least 2 characters').max(100, 'At most 100 characters'),
    description: z.string().trim().min(10, 'At least 10 characters').max(2000, 'At most 2000 characters'),
    genre: z.enum(genres, 'Pick a genre'),
    platforms: z.array(z.enum(platforms)).min(1, 'Pick at least one platform'),
    publisher: z.string().trim().min(2, 'At least 2 characters'),
    pegi: z.literal(pegiRatings, 'Pick an age rating'),
    price: z.number('Enter a price').positive('Must be more than 0'),
    deluxePrice: z.number().positive('Must be more than 0').nullable(),
    discountPercent: z.number('Enter 0 for no discount').int('Whole number').min(0).max(90, 'At most 90'),
    releaseDate: z.iso.date('Pick a date'),
    coverUrl: z.url('Enter a full image URL'),
    inStock: z.boolean(),
  })
  .refine((game) => game.deluxePrice === null || game.deluxePrice > game.price, {
    path: ['deluxePrice'],
    message: 'Deluxe must cost more than Standard',
  })

type GameFormValues = z.infer<typeof gameSchema>

type GameFormProps = {
  defaultValues?: NewGame
  onSubmit: (values: NewGame) => void
  submitting: boolean
  submitLabel: string
  cancel?: ReactNode
}

const emptyGame: Partial<GameFormValues> = { platforms: [], deluxePrice: null, discountPercent: 0, inStock: true }

// react-hook-form also passes the default value here (a number or null), not only the input text.
const isEmpty = (value: unknown) => value === '' || value === null || value === undefined
const toNumber = (value: unknown) => (isEmpty(value) ? Number.NaN : Number(value))
const toNullableNumber = (value: unknown) => (isEmpty(value) ? null : Number(value))

type FieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

// One form for creating and editing a game (admin only), validated with zod.
export function GameForm({ defaultValues, onSubmit, submitting, submitLabel, cancel }: GameFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormValues>({ resolver: zodResolver(gameSchema), defaultValues: defaultValues ?? emptyGame })

  const invalid = (name: keyof GameFormValues) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-w-2xl flex-col gap-6">
      <Field id="title" label="Title" error={errors.title?.message}>
        <Input id="title" {...invalid('title')} {...register('title')} />
      </Field>

      <Field id="description" label="Description" error={errors.description?.message}>
        <Textarea id="description" rows={4} {...invalid('description')} {...register('description')} />
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="publisher" label="Publisher" error={errors.publisher?.message}>
          <Input id="publisher" {...invalid('publisher')} {...register('publisher')} />
        </Field>

        <Field id="genre" label="Genre" error={errors.genre?.message}>
          <Controller
            control={control}
            name="genre"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="genre" className="w-full" {...invalid('genre')}>
                  <SelectValue placeholder="Pick a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genreLabels[genre]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.platforms ? 'platforms-error' : undefined}>
        <legend className="mb-2 text-sm font-medium">Platforms</legend>
        <Controller
          control={control}
          name="platforms"
          render={({ field }) => (
            <div className="flex flex-wrap gap-4">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={field.value?.includes(platform) ?? false}
                    onCheckedChange={(checked) => {
                      const current = field.value ?? []
                      field.onChange(checked ? [...current, platform] : current.filter((p) => p !== platform))
                    }}
                  />
                  <Label htmlFor={`platform-${platform}`}>{platformLabels[platform]}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.platforms && (
          <p id="platforms-error" className="text-sm text-destructive">
            {errors.platforms.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 md:grid-cols-3">
        <Field id="price" label="Standard price (€)" error={errors.price?.message}>
          <Input
            id="price"
            type="number"
            step="0.01"
            min={0}
            {...invalid('price')}
            {...register('price', { setValueAs: toNumber })}
          />
        </Field>
        <Field id="deluxePrice" label="Deluxe price (€, optional)" error={errors.deluxePrice?.message}>
          <Input
            id="deluxePrice"
            type="number"
            step="0.01"
            min={0}
            {...invalid('deluxePrice')}
            {...register('deluxePrice', { setValueAs: toNullableNumber })}
          />
        </Field>
        <Field id="discountPercent" label="Discount (%)" error={errors.discountPercent?.message}>
          <Input
            id="discountPercent"
            type="number"
            min={0}
            max={90}
            {...invalid('discountPercent')}
            {...register('discountPercent', { setValueAs: toNumber })}
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="pegi" label="Age rating" error={errors.pegi?.message}>
          <Controller
            control={control}
            name="pegi"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger id="pegi" className="w-full" {...invalid('pegi')}>
                  <SelectValue placeholder="Pick an age rating" />
                </SelectTrigger>
                <SelectContent>
                  {pegiRatings.map((pegi) => (
                    <SelectItem key={pegi} value={String(pegi)}>
                      PEGI {pegi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field id="releaseDate" label="Release date" error={errors.releaseDate?.message}>
          <Input id="releaseDate" type="date" {...invalid('releaseDate')} {...register('releaseDate')} />
        </Field>
      </div>

      <Field id="coverUrl" label="Box art URL (portrait, 3:4)" error={errors.coverUrl?.message}>
        <Input id="coverUrl" type="url" placeholder="https://" {...invalid('coverUrl')} {...register('coverUrl')} />
      </Field>

      <Controller
        control={control}
        name="inStock"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox id="inStock" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
            <Label htmlFor="inStock">In stock</Label>
          </div>
        )}
      />

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        {cancel}
      </div>
    </form>
  )
}
