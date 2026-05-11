import { sendQuestionReply } from '@/app/lib/actions/question/sendQuestionReply'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { DrawerShell } from '../elements/DrawerShell'
import { FormError, FormField, FormTextarea } from '../elements/FormField'
import { DrawerFormFooter } from '../elements/DrawerFormFooter'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

export function QuestionDrawer({
  question,
  onClose,
  onResponded
}: {
  question: IQuestion | null
  onClose: () => void
  onResponded: (id: string) => void
  onDeleted: (id: string) => void
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailFailed, setEmailFailed] = useState(false)
  const [sentReply, setSentReply] = useState<string | null>(null)
  const { play } = useSoundEffect('/mp3/se-1.mp3', true)

  const open = question !== null

  async function handleSend(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!reply.trim() || !question) return
    setError(null)
    setSending(true)
    try {
      const result = await sendQuestionReply({
        questionId: question.id,
        toEmail: question.email,
        toName: question.name,
        originalMessage: question.message,
        message: reply.trim()
      })
      if (!result.success) {
        setError(result.error ?? 'Failed to send reply.')
        setSending(false)
        return
      }
      if (result.emailFailed) {
        setEmailFailed(true)
        setSentReply(reply.trim())
        setSending(false)
        onResponded(question.id)
        return
      }

      play()
      onClose()
      setSentReply(reply.trim())
      setSending(false)
      onResponded(question.id)
    } catch {
      setError('Something went wrong.')
      setSending(false)
    }
  }

  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      label={question?.hasResponded ? 'QUESTION — RESPONDED' : 'QUESTION — PENDING'}
      width="w-[32rem]"
    >
      {question && (
        <form onSubmit={handleSend} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <div className="flex-1 px-4 py-4 flex flex-col gap-5">
            {/* Sender info */}
            <div className="flex flex-col gap-3 pb-4 border-b border-border-dark">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/80">From</span>
                  <span className="text-[12px] font-mono text-text-dark">{question.name}</span>
                  <a
                    href={`mailto:${question.email}`}
                    className="text-[11px] font-mono text-primary-dark hover:text-blaze-text transition-colors"
                  >
                    {question.email}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/80">Received</span>
                  <span className="text-[10px] font-mono text-muted-dark/80 tabular-nums">
                    {new Date(question.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-[10px] font-mono text-muted-dark/70 tabular-nums">
                    {new Date(question.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 border ${
                    question.hasResponded
                      ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                      : 'text-amber-400 border-amber-400/30 bg-amber-400/5'
                  }`}
                >
                  {question.hasResponded ? 'Responded' : 'Pending Response'}
                </span>
              </div>
            </div>

            {/* Original message */}
            <div className="flex flex-col gap-2">
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/80">Message</span>
              <div className="bg-surface-dark border border-border-dark px-3 py-3">
                <p className="text-[12px] font-mono text-text-dark leading-relaxed whitespace-pre-wrap">
                  {question.message}
                </p>
              </div>
            </div>

            {question.replyMessage ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-muted-dark/80">
                    Previous Reply Sent
                  </span>
                  <span className="text-[8px] font-mono text-muted-dark/70 tabular-nums">
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
            ) : (
              <>
                {/* Reply form */}
                <FormField label="Reply" htmlFor="question-reply">
                  <FormTextarea
                    id="question-reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your reply..."
                    rows={6}
                  />
                </FormField>
              </>
            )}

            <FormError error={error} />

            {emailFailed && (
              <div className="border border-amber-400/30 bg-amber-400/5 px-3 py-2">
                <span className="text-[10px] font-mono text-amber-400">
                  Reply saved but email failed to send. The response has been recorded.
                </span>
              </div>
            )}
          </div>

          {!(sentReply || question.replyMessage) && (
            <DrawerFormFooter
              onCancel={onClose}
              busy={sending}
              saving={sending}
              isEdit={false}
              submitLabel="Send Reply"
            />
          )}
          {(sentReply || question.replyMessage) && (
            <div className="shrink-0 flex items-center justify-end px-4 py-3 border-t border-border-dark bg-surface-dark">
              <button
                type="button"
                onClick={onClose}
                className="text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 border border-border-dark text-muted-dark/80 hover:text-text-dark hover:border-muted-dark/30 transition-colors"
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
