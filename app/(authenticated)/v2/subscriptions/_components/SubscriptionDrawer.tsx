'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2, Loader2, ExternalLink, Plus } from 'lucide-react'
import { STATUS_SELECT_OPTIONS, TYPE_SELECT_OPTIONS } from '@/app/lib/constants/subscription.constants'
import {
  IPricingTier,
  ISubscription,
  ISubscriptionInput,
  SubscriptionStatus,
  SubscriptionType
} from '@/app/types/entities/subscription.types'
import { createSubscription, deleteSubscription, updateSubscription } from '@/app/lib/actions/subscription'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  subscription: ISubscription | null
  onClose: () => void
  onSaved: (s: ISubscription) => void
  onDeleted: (id: string) => void
}

const FIELD =
  'w-full bg-bg-dark border border-border-dark px-3 py-2 text-sm font-mono text-text-dark placeholder:text-muted-dark/50 focus:outline-none focus:border-primary-dark transition-colors'
const LABEL = 'text-[10px] font-mono uppercase tracking-[0.16em] text-muted-dark mb-1.5 block'

export function SubscriptionDrawer({ open, mode, subscription, onClose, onSaved, onDeleted }: Props) {
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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ISubscriptionInput>(key: K, value: ISubscriptionInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const addTier = () => setForm((f) => ({ ...f, pricingTiers: [...f.pricingTiers, { label: '', price: '' }] }))

  const updateTier = (index: number, key: keyof IPricingTier, value: string) =>
    setForm((f) => ({
      ...f,
      pricingTiers: f.pricingTiers.map((t, i) => (i === index ? { ...t, [key]: value } : t))
    }))

  const removeTier = (index: number) =>
    setForm((f) => ({ ...f, pricingTiers: f.pricingTiers.filter((_, i) => i !== index) }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const result =
      mode === 'create' ? await createSubscription(form) : await updateSubscription(subscription?.id ?? '', form)

    setSaving(false)

    if (!result.success || !result.data) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    onSaved(result.data)
  }

  const handleDelete = async () => {
    if (!subscription?.id) return
    setDeleting(true)
    setError(null)

    const result = await deleteSubscription(subscription.id)
    setDeleting(false)

    if (!result.success) {
      setError(result.error ?? 'Failed to delete')
      return
    }

    onDeleted(subscription.id)
  }

  const busy = saving || deleting

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={busy ? undefined : onClose}
            className="fixed inset-0 z-40 bg-black/70"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface-dark border-l border-border-dark flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-dark">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-dark">
                  [ {mode === 'create' ? 'New Subscription' : 'Edit Subscription'} ]
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="text-muted-dark hover:text-text-dark transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className={LABEL} htmlFor="sub-name">
                  Name
                </label>
                <input
                  id="sub-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Season 2026–27 Saturday Matinee (A)"
                  className={FIELD}
                />
              </div>

              {/* Tagline */}
              <div>
                <label className={LABEL} htmlFor="sub-tagline">
                  Tagline <span className="text-muted-dark/50 normal-case">(optional, shows under the name)</span>
                </label>
                <input
                  id="sub-tagline"
                  type="text"
                  value={form.tagline}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="4 Show Season Package · December at Riverview"
                  className={FIELD}
                />
              </div>

              {/* Type + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL} htmlFor="sub-type">
                    Type
                  </label>
                  <select
                    id="sub-type"
                    value={form.type}
                    onChange={(e) => set('type', e.target.value as SubscriptionType)}
                    className={FIELD}
                  >
                    {TYPE_SELECT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL} htmlFor="sub-status">
                    Status
                  </label>
                  <select
                    id="sub-status"
                    value={form.status}
                    onChange={(e) => set('status', e.target.value as SubscriptionStatus)}
                    className={FIELD}
                  >
                    {STATUS_SELECT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visible toggle */}
              <button
                type="button"
                onClick={() => set('isVisible', !form.isVisible)}
                className="flex items-center justify-between w-full bg-bg-dark border border-border-dark px-3 py-2.5 hover:border-muted-dark transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-dark">
                    Visible on website
                  </span>
                  <span className="text-[9px] font-mono text-muted-dark/60 mt-0.5">
                    {form.isVisible ? 'Patrons can see and buy this' : 'Hidden from the public site'}
                  </span>
                </div>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    form.isVisible ? 'bg-emerald-400/80' : 'bg-border-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      form.isVisible ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </span>
              </button>

              {/* Public URL */}
              <div>
                <label className={LABEL} htmlFor="sub-public">
                  Public URL <span className="text-muted-dark/50 normal-case">(where patrons buy)</span>
                </label>
                <input
                  id="sub-public"
                  type="url"
                  value={form.publicUrl}
                  onChange={(e) => set('publicUrl', e.target.value)}
                  placeholder="https://thepopsorchestra.app.getcuebox.com/o/..."
                  className={FIELD}
                />
                {form.publicUrl && (
                  <a
                    href={form.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.12em] text-muted-dark/70 hover:text-primary-dark transition-colors"
                  >
                    Open public page <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {/* CueBox Edit URL */}
              <div>
                <label className={LABEL} htmlFor="sub-edit">
                  CueBox Edit URL <span className="text-muted-dark/50 normal-case">(your management link)</span>
                </label>
                <input
                  id="sub-edit"
                  type="url"
                  value={form.cueboxEditUrl}
                  onChange={(e) => set('cueboxEditUrl', e.target.value)}
                  placeholder="https://app.getcuebox.com/a/.../season-subscriptions/..."
                  className={FIELD}
                />
              </div>

              {/* Description */}
              <div>
                <label className={LABEL} htmlFor="sub-description">
                  Description{' '}
                  <span className="text-muted-dark/50 normal-case">
                    (what&apos;s included, show list, season blurb)
                  </span>
                </label>
                <textarea
                  id="sub-description"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={8}
                  placeholder={
                    'This 4 Show Season Package Includes:\n\nBorn in the U.S.A. — Saturday, November 14, 3:00 p.m., Riverview\nRing in the Holidays — Sunday, December 13, 3:00 p.m., Riverview\n…\n\nThis season, Like No Other, will absolutely live up to its name…'
                  }
                  className={`${FIELD} resize-y leading-relaxed`}
                />
                <p className="mt-1 text-[9px] font-mono text-muted-dark/60 leading-relaxed">
                  You can paste this straight from CueBox. Blank lines create paragraph breaks on the website.
                </p>
              </div>

              {/* Pricing tiers */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`${LABEL} mb-0`}>Pricing Tiers</span>
                  <button
                    type="button"
                    onClick={addTier}
                    className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.12em] text-muted-dark hover:text-primary-dark transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add tier
                  </button>
                </div>

                {form.pricingTiers.length === 0 ? (
                  <p className="text-[10px] font-mono text-muted-dark/60 border border-dashed border-border-dark px-3 py-3 text-center">
                    No pricing tiers yet. Add one for each seat level (e.g. General, Premium, Ultra).
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {form.pricingTiers.map((tier, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) => updateTier(i, 'price', e.target.value)}
                          placeholder="$130"
                          className={`${FIELD} flex-1`}
                          aria-label={`Tier ${i + 1} price`}
                        />
                        <input
                          type="text"
                          value={tier.label}
                          onChange={(e) => updateTier(i, 'label', e.target.value)}
                          placeholder="General Seats"
                          className={`${FIELD} flex-1`}
                          aria-label={`Tier ${i + 1} label`}
                        />

                        <button
                          type="button"
                          onClick={() => removeTier(i)}
                          className="shrink-0 text-muted-dark/70 hover:text-primary-dark transition-colors p-1"
                          aria-label={`Remove tier ${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <p className="text-[11px] font-mono text-primary-dark border border-primary-dark/30 bg-primary-dark/5 px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Footer actions */}
            <div className="shrink-0 border-t border-border-dark px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-dark text-white px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.16em] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {mode === 'create' ? 'Create' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-muted-dark border border-border-dark hover:text-text-dark transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* Delete (edit mode only) */}
              {mode === 'edit' && (
                <div>
                  {confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={busy}
                        className="flex-1 flex items-center justify-center gap-2 border border-primary-dark/40 text-primary-dark px-4 py-2 text-[10px] font-mono uppercase tracking-[0.16em] hover:bg-primary-dark/5 transition-colors disabled:opacity-50"
                      >
                        {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={busy}
                        className="px-4 py-2 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-dark hover:text-text-dark transition-colors disabled:opacity-50"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-dark/70 hover:text-primary-dark transition-colors py-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete subscription
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
