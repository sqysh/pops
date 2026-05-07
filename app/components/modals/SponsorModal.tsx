'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Loader2, Tag, Link, DollarSign, Check, Image as Img } from 'lucide-react'
import type { Sponsor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useFormState } from '@/app/lib/hooks/useFormState'
import uploadFileToFirebase from '@/app/utils/firebase.upload'
import { store } from '@/app/redux/store'
import { showToast } from '@/app/redux/features/toastSlice'
import { updateSponsor } from '@/app/lib/actions/sponsor/updateSponsor'
import { createSponsor } from '@/app/lib/actions/sponsor/createSponsor'
import Picture from '../common/Picture'
import { inputCls } from '@/app/lib/constants/common'
import { FieldLabel } from '../common/FieldLabel'

// ─── Config ───────────────────────────────────────────────────────────────────

const SPONSOR_LEVELS = [
  'SEASON_SPONSOR',
  'CONCERT_SPONSOR',
  'GUEST_ARTIST_SPONSOR',
  'PRINCIPAL_SPONSOR',
  'MEDIA_SPONSOR',
  'PARTNER'
]

interface Props {
  sponsor?: Sponsor | null
  onClose: () => void
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SponsorModal({ sponsor, onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!sponsor

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(sponsor?.filePath ?? null)
  const [customLevel, setCustomLevel] = useState('')
  const [showCustomLevel, setShowCustomLevel] = useState(false)

  const { form, set } = useFormState({
    name: sponsor?.name ?? '',
    level: sponsor?.level.toUpperCase().split(' ').join('_') ?? '',
    amount: sponsor?.amount ?? 0, // ensure this is a number
    externalLink: sponsor?.externalLink ?? '',
    filePath: sponsor?.filePath ?? '',
    filename: sponsor?.filename ?? '',
    isActive: sponsor?.isActive ?? true
  })

  const handleImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setUploadProgress(0)
    const url = await uploadFileToFirebase(file, setUploadProgress).catch(() => null)
    setUploading(false)

    if (!url) {
      store.dispatch(showToast({ type: 'error', message: 'Image upload failed' }))
      return
    }

    set('filePath', url)
    set('filename', file.name)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Sponsor name is required' }))
      return
    }
    if (!form.filePath) {
      store.dispatch(showToast({ type: 'error', message: 'Please upload a sponsor logo' }))
      return
    }

    setLoading(true)

    const payload = {
      ...form,
      level: showCustomLevel ? customLevel : form.level
    }

    const res = isEditing && sponsor ? await updateSponsor(sponsor.id, payload) : await createSponsor(payload)

    setLoading(false)

    if (res.success) {
      store.dispatch(showToast({ type: 'success', message: isEditing ? 'Sponsor updated' : 'Sponsor created' }))
      router.refresh()
      onClose()
    } else {
      store.dispatch(showToast({ type: 'error', message: res.error ?? 'Something went wrong' }))
    }
  }

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          aria-hidden="true"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%', transition: { type: 'tween', duration: 0.25, ease: 'easeIn' } }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-surface-dark border-t border-border-dark max-h-[90vh] flex flex-col sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:border sm:border-border-dark"
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? 'Edit sponsor' : 'Add sponsor'}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-border-dark" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark shrink-0">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-dark" aria-hidden="true" />
              <h2 className="font-quicksand font-black text-text-dark text-base leading-none">
                {isEditing ? 'Edit Sponsor' : 'Add Sponsor'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Logo upload — top and prominent */}
            <div>
              <FieldLabel required>Logo</FieldLabel>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="w-full border border-dashed border-border-dark hover:border-primary-dark transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
                aria-label="Upload sponsor logo"
              >
                {imagePreview ? (
                  <div className="relative h-28 overflow-hidden">
                    <Picture
                      priority
                      src={imagePreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-3 bg-bg-dark"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-white" aria-hidden="true" />
                      <span className="text-white text-[10px] font-mono">Replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 flex flex-col items-center justify-center gap-2 bg-bg-dark">
                    <Img
                      className="w-6 h-6 text-muted-dark group-hover:text-primary-dark transition-colors"
                      aria-hidden="true"
                    />
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-dark group-hover:text-text-dark transition-colors">
                      Upload Logo
                    </span>
                    <span className="text-[9px] font-mono text-muted-dark/40">PNG, JPG, SVG — up to 10MB</span>
                  </div>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleImage(f)
                }}
              />
              {uploading && (
                <div className="mt-1.5">
                  <div className="h-px bg-border-dark w-full">
                    <div
                      className="h-px bg-primary-dark transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-mono text-muted-dark mt-1">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <FieldLabel htmlFor="sponsor-name" required>
                Sponsor Name
              </FieldLabel>
              <input
                id="sponsor-name"
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Acme Corporation"
                className={inputCls}
              />
            </div>

            {/* Level */}
            <div>
              <FieldLabel htmlFor="sponsor-level">Sponsorship Level</FieldLabel>
              {showCustomLevel ? (
                <div className="flex gap-2">
                  <input
                    id="sponsor-level"
                    type="text"
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value)}
                    placeholder="Enter custom level"
                    className={`${inputCls} flex-1`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLevel(false)
                      setCustomLevel('')
                    }}
                    className="px-3 border border-border-dark text-muted-dark hover:text-text-dark text-[9px] font-mono uppercase tracking-widest transition-colors focus-visible:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {SPONSOR_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => set('level', level)}
                        className={`px-3 py-2 text-left text-[10px] font-mono tracking-widest uppercase border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
                          form.level === level
                            ? 'border-primary-dark bg-primary-dark/10 text-text-dark'
                            : 'border-border-dark text-muted-dark hover:border-muted-dark hover:bg-button-dark'
                        }`}
                      >
                        {level.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLevel(true)
                      set('level', '')
                    }}
                    className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-dark/50 hover:text-primary-dark transition-colors focus-visible:outline-none"
                  >
                    + Custom level
                  </button>
                </div>
              )}
            </div>

            {/* Amount + External Link */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="sponsor-amount">Amount ($)</FieldLabel>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-dark pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="sponsor-amount"
                    type="number"
                    value={form.amount || ''}
                    onChange={(e) => set('amount', Number(e.target.value))}
                    placeholder="0"
                    min={0}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
            </div>

            {/* External Link */}
            <div>
              <FieldLabel htmlFor="sponsor-link">Website</FieldLabel>
              <div className="relative">
                <Link
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-dark pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="sponsor-link"
                  type="url"
                  value={form.externalLink}
                  onChange={(e) => set('externalLink', e.target.value)}
                  placeholder="https://sponsor-website.com"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between px-3 py-2.5 border border-border-dark bg-bg-dark">
              <div>
                <p className="text-text-dark text-xs font-medium">Active</p>
                <p className="text-muted-dark text-[10px] mt-0.5">Show on public site</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() => set('isActive', !form.isActive)}
                className={`relative w-9 h-4 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark ${
                  form.isActive ? 'bg-primary-dark' : 'bg-border-dark'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 bg-white transition-all duration-200 ${
                    form.isActive ? 'left-5' : 'left-0.5'
                  }`}
                />
                <span className="sr-only">{form.isActive ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-4 py-3 border-t border-border-dark shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-border-dark text-muted-dark hover:text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="flex-1 py-2.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Save Changes' : 'Add Sponsor'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
