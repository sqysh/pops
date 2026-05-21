'use client'

import { sendQuestionReply } from '@/app/lib/actions/question/sendQuestionReply'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormTextarea } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { markAsSpam } from '@/app/lib/actions/question/markAsSpam'
import { Ban, MailCheck, ShieldAlert, ShieldX } from 'lucide-react'
import { markQuestionAsResponded } from '@/app/lib/actions/question/markQuestionAsResponded'

export function QuestionDrawer({
  question,
  onClose,
  onResponded,
  onMarkedSpam
}: {
  question: IQuestion | null
  onClose: () => void
  onResponded: (id: string, reply?: string) => void
  onMarkedSpam: (id: string) => void
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [markingSpam, setMarkingSpam] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailFailed, setEmailFailed] = useState(false)
  const [sentReply, setSentReply] = useState<string | null>(null)
  const { play } = useSoundEffect('/mp3/se-1.mp3', true)
  const { play: deletedSE } = useSoundEffect('/mp3/se-2.mp3', true)

  const open = question !== null

  async function handleSend(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!reply.trim() || !question) return
    setError(null)
    setSending(true)
    const result = await sendQuestionReply({
      questionId: question.id,
      toEmail: question.email,
      toName: question.name,
      originalMessage: question.message,
      message: reply.trim()
    })
    setSending(false)
    if (!result.success) {
      setError(result.error ?? 'Failed to send reply.')
      return
    }
    if (result.emailFailed) {
      setEmailFailed(true)
      setSentReply(reply.trim())
      onResponded(question.id)
      return
    }
    play()
    setSentReply(reply.trim())
    onResponded(question.id, reply.trim())
    onClose()
  }

  async function handleMarkAsSpam() {
    if (!question) return
    setMarkingSpam(true)
    const result = await markAsSpam(question.id)
    setMarkingSpam(false)
    if (result.success) {
      deletedSE()
      onMarkedSpam(question.id)
      onClose()
    } else {
      setError(result.error ?? 'Failed to mark as spam.')
    }
  }

  const [markingResponded, setMarkingResponded] = useState(false)

  async function handleMarkAsResponded() {
    if (!question) return
    setMarkingResponded(true)
    const result = await markQuestionAsResponded(question.id)
    setMarkingResponded(false)
    if (result.success) {
      onResponded(question.id)
      onClose()
    } else {
      setError(result.error ?? 'Failed to mark as responded.')
    }
  }

  const drawerLabel = question?.isSpam
    ? 'QUESTION — SPAM'
    : question?.isPotentialSpam
      ? 'QUESTION — FLAGGED'
      : question?.hasResponded
        ? 'QUESTION — RESPONDED'
        : 'QUESTION — PENDING'

  return (
    <DrawerShell open={open} onClose={onClose} label={drawerLabel} width="w-[32rem]">
      {question && (
        <form onSubmit={handleSend} className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
            {/* Spam / flagged warning banner */}
            {(question.isSpam || question.isPotentialSpam) && (
              <div
                className={`flex items-start gap-3 px-3 py-3 border ${
                  question.isSpam ? 'border-red-500/30 bg-red-500/5' : 'border-orange-500/30 bg-orange-500/5'
                }`}
              >
                {question.isSpam ? (
                  <ShieldX className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest ${question.isSpam ? 'text-red-400' : 'text-orange-400'}`}
                  >
                    {question.isSpam ? 'Marked as spam' : 'Potential spam detected'}
                  </span>
                  <span className="text-[10px] font-mono text-muted-dark/80 leading-relaxed">
                    {question.isSpam
                      ? 'This message has been confirmed as spam and is hidden from the main inbox.'
                      : 'This message was automatically flagged. Review it and mark as spam or clear the flag.'}
                  </span>
                </div>
              </div>
            )}

            {/* Sender info */}
            <div className="flex flex-col gap-3 pb-4 border-b border-border-dark">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/80">From</span>
                  <span className="text-[12px] font-mono text-text-dark">{question.name}</span>
                  <a
                    href={`mailto:${question.email}`}
                    className="text-[12px] font-mono text-primary-dark hover:text-blaze-text transition-colors"
                  >
                    {question.email}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/80">Received</span>
                  <span className="text-[11px] font-mono text-muted-dark/80 tabular-nums">
                    {new Date(question.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-[11px] font-mono text-muted-dark/70 tabular-nums">
                    {new Date(question.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {!question.isSpam && (
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border ${
                      question.hasResponded
                        ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                        : 'text-amber-400 border-amber-400/30 bg-amber-400/5'
                    }`}
                  >
                    {question.hasResponded ? 'Responded' : 'Pending Response'}
                  </span>
                )}
                {question.isSpam && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 border text-red-400 border-red-400/30 bg-red-400/5">
                    Spam
                  </span>
                )}
                {!question.isSpam && question.isPotentialSpam && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 border text-orange-400 border-orange-400/30 bg-orange-400/5">
                    Flagged
                  </span>
                )}
              </div>
            </div>

            {/* Original message */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/80">Message</span>
              <div className="bg-surface-dark border border-border-dark px-3 py-3">
                <p className="text-[12px] font-mono text-text-dark leading-relaxed whitespace-pre-wrap">
                  {question.message}
                </p>
              </div>
            </div>

            {/* Previous reply */}
            {question.replyMessage ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/80">
                    Previous Reply Sent
                  </span>
                  <span className="text-[9px] font-mono text-muted-dark/70 tabular-nums">
                    {new Date(question.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}{' '}
                    {new Date(question.updatedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="bg-surface-dark border border-emerald-400/20 px-3 py-3">
                  <p className="text-[12px] font-mono text-text-dark/90 leading-relaxed whitespace-pre-wrap">
                    {question.replyMessage}
                  </p>
                </div>
              </div>
            ) : !question.isSpam ? (
              <FormField label="Reply" htmlFor="question-reply">
                <FormTextarea
                  id="question-reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  rows={6}
                  maxLength={2000}
                />
                <span
                  className={`text-[13px] font-mono tabular-nums ${reply.length > 1800 ? 'text-amber-400' : 'text-muted-dark'}`}
                >
                  {reply.length} / 2000
                </span>
              </FormField>
            ) : null}

            {question.hasResponded && !question.replyMessage && !question.isSpam && (
              <div className="flex items-start gap-2 border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5">
                <MailCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-emerald-400/80 leading-relaxed">
                  This inquiry was marked as responded — a reply may have been sent outside of this system.
                </p>
              </div>
            )}

            <FormError error={error} />

            {emailFailed && (
              <div className="border border-amber-400/30 bg-amber-400/5 px-3 py-2">
                <span className="text-[11px] font-mono text-amber-400">
                  Reply saved but email failed to send. The response has been recorded.
                </span>
              </div>
            )}

            {/* Actions */}
            {!question.hasResponded && !question.isSpam && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border-dark">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark/50">Actions</span>
                <button
                  type="button"
                  onClick={handleMarkAsResponded}
                  disabled={markingResponded}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-mono uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors disabled:opacity-40"
                >
                  <MailCheck className="w-3 h-3" />
                  {markingResponded ? 'Marking...' : 'Mark as Responded'}
                </button>
                <button
                  type="button"
                  onClick={handleMarkAsSpam}
                  disabled={markingSpam}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-500/30 bg-red-500/5 text-[9px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors disabled:opacity-40"
                >
                  <Ban className="w-3 h-3" />
                  {markingSpam ? 'Marking...' : 'Mark as Spam'}
                </button>
              </div>
            )}
          </div>

          {!(sentReply || question.replyMessage) && !question.isSpam && !question.hasResponded && (
            <DrawerFormFooter
              onCancel={onClose}
              busy={sending}
              saving={sending}
              isEdit={false}
              submitLabel="Send Reply"
            />
          )}
          {(sentReply || question.replyMessage || question.isSpam || question.hasResponded) && (
            <div className="shrink-0 flex items-center justify-end px-4 py-3 border-t border-border-dark bg-surface-dark">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-border-dark text-muted-dark/80 hover:text-text-dark hover:border-muted-dark/30 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </form>
      )}
    </DrawerShell>
  )
}
