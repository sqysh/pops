'use client'

import { useState } from 'react'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { STATUS_SELECT_OPTIONS, TYPE_SELECT_OPTIONS } from '@/app/lib/constants/subscription.constants'
import {
  IPricingTier,
  ISubscription,
  ISubscriptionInput,
  SubscriptionStatus,
  SubscriptionType
} from '@/app/types/entities/subscription.types'
import { createSubscription, deleteSubscription, updateSubscription } from '@/app/lib/actions/subscription'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { DrawerBody } from '@/app/(authenticated)/v2/_components/DrawerElements'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import { DangerZone } from '@/app/(authenticated)/v2/_components/DangerZone'
import {
  FormError,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormToggle,
  LABEL
} from '@/app/(authenticated)/v2/_components/FormField'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  subscription: ISubscription | null
  onClose: () => void
  onSaved: (s: ISubscription) => void
  onDeleted: (id: string) => void
}

const DESCRIPTION_PLACEHOLDER =
  'This 4 Show Season Package Includes:\n\nBorn in the U.S.A. — Saturday, November 14, 3:00 p.m., Riverview\nRing in the Holidays — Sunday, December 13, 3:00 p.m., Riverview\n\nThis season, Like No Other, will absolutely live up to its name…'

export function SubscriptionDrawer({ open, mode, subscription, onClose, onSaved, onDeleted }: Props) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState<ISubscriptionInput>({
    name: subscription?.name ?? '',
    type: subscription?.type ?? 'SUBSCRIPTION',
    status: subscription?.status ?? 'NOT_ON_SALE',
    isVisible: subscription?.isVisible ?? false,
    publicUrl: subscription?.publicUrl ?? '',
    cueboxEditUrl: subscription?.cueboxEditUrl ?? '',
    tagline: subscription?.tagline ?? '',
    description: subscription?.description ?? '',
    pricingTiers: subscription?.pricingTiers ?? []
  })

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = saving || deleting

  const set = <K extends keyof ISubscriptionInput>(key: K, value: ISubscriptionInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'name') setNameError(null)
  }

  const addTier = () => setForm((f) => ({ ...f, pricingTiers: [...f.pricingTiers, { label: '', price: '' }] }))

  const updateTier = (index: number, key: keyof IPricingTier, value: string) =>
    setForm((f) => ({
      ...f,
      pricingTiers: f.pricingTiers.map((t, i) => (i === index ? { ...t, [key]: value } : t))
    }))

  const removeTier = (index: number) => setForm((f) => ({ ...f, pricingTiers: f.pricingTiers.filter((_, i) => i !== index) }))

  function handleClose() {
    if (busy) return
    setError(null)
    setNameError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name.trim()) {
      setNameError('Give the subscription a name before saving.')
      return
    }

    setError(null)
    setSaving(true)

    const result = isEdit ? await updateSubscription(subscription?.id ?? '', form) : await createSubscription(form)

    setSaving(false)

    if (!result.success || !result.data) {
      setError(result.error ?? 'Something went wrong.')
      return
    }

    onSaved(result.data)
  }

  async function handleDelete() {
    if (!subscription?.id) return

    setError(null)
    setDeleting(true)

    const result = await deleteSubscription(subscription.id)
    setDeleting(false)

    if (!result.success) {
      setError(result.error ?? 'Failed to delete this subscription.')
      return
    }

    onDeleted(subscription.id)
  }

  return (
    <DrawerShell
      open={open}
      onClose={handleClose}
      label={isEdit ? (subscription?.name ?? 'Edit subscription') : 'New subscription'}
      width="w-[32rem]"
    >
      <form onSubmit={handleSubmit} noValidate className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
        <DrawerBody>
          <FormField label="Name" required error={nameError}>
            <FormInput
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Season 2026–27 Saturday Matinee (A)"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Tagline" hint="One short line, shown under the name on the website.">
            <FormInput
              type="text"
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="4 show season package · December at Riverview"
              autoComplete="off"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type">
              <FormSelect value={form.type} onChange={(e) => set('type', e.target.value as SubscriptionType)}>
                {TYPE_SELECT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Status">
              <FormSelect value={form.status} onChange={(e) => set('status', e.target.value as SubscriptionStatus)}>
                {STATUS_SELECT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          </div>

          <FormToggle
            label="Visible on the website"
            description={
              form.isVisible
                ? 'Patrons can see this. It only shows a buy button once the status is On Sale.'
                : 'Hidden from the public site.'
            }
            value={form.isVisible}
            onChange={(val) => set('isVisible', val)}
          />

          <div className="border-t border-neutral-200" />

          <FormField label="Public URL" hint="Where patrons go to buy.">
            <FormInput
              type="url"
              value={form.publicUrl}
              onChange={(e) => set('publicUrl', e.target.value)}
              placeholder="https://thepopsorchestra.app.getcuebox.com/o/..."
              autoComplete="off"
            />
          </FormField>

          {form.publicUrl && (
            <a
              href={form.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="-mt-2 inline-flex items-center gap-1.5 w-fit text-xs font-medium text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
            >
              Open the public page
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          )}

          <FormField label="CueBox edit URL" hint="Your management link in CueBox. Patrons never see this.">
            <FormInput
              type="url"
              value={form.cueboxEditUrl}
              onChange={(e) => set('cueboxEditUrl', e.target.value)}
              placeholder="https://app.getcuebox.com/a/.../season-subscriptions/..."
              autoComplete="off"
            />
          </FormField>

          <div className="border-t border-neutral-200" />

          <FormField
            label="Description"
            hint="What's included, the show list, the season blurb. Paste it straight from CueBox. A blank line starts a new paragraph on the website."
          >
            <FormTextarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={8}
              placeholder={DESCRIPTION_PLACEHOLDER}
            />
          </FormField>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={LABEL}>Pricing tiers</span>
              <button
                type="button"
                onClick={addTier}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Add tier
              </button>
            </div>

            {form.pricingTiers.length === 0 ? (
              <p className="border border-dashed border-neutral-300 px-3 py-4 text-center text-neutral-500 leading-relaxed">
                No pricing tiers yet. Add one for each seat level, such as General, Premium and Ultra.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {form.pricingTiers.map((tier, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FormInput
                      type="text"
                      value={tier.price}
                      onChange={(e) => updateTier(i, 'price', e.target.value)}
                      placeholder="$130"
                      className="flex-1"
                      aria-label={`Tier ${i + 1} price`}
                    />
                    <FormInput
                      type="text"
                      value={tier.label}
                      onChange={(e) => updateTier(i, 'label', e.target.value)}
                      placeholder="General Seating"
                      className="flex-1"
                      aria-label={`Tier ${i + 1} label`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      aria-label={`Remove tier ${i + 1}`}
                      className="shrink-0 flex items-center justify-center w-9 h-9 text-neutral-400 hover:text-red-700 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                <p className="text-xs text-neutral-500 leading-relaxed">
                  The price shows exactly as you type it, so include the dollar sign.
                </p>
              </div>
            )}
          </div>

          <FormError error={error} />

          {isEdit && subscription && <DangerZone label="Delete subscription" name={subscription.name} onConfirm={handleDelete} />}
        </DrawerBody>

        <DrawerFormFooter
          onCancel={handleClose}
          busy={busy}
          saving={saving}
          isEdit={isEdit}
          submitLabel="Create subscription"
          editLabel="Save changes"
        />
      </form>
    </DrawerShell>
  )
}
