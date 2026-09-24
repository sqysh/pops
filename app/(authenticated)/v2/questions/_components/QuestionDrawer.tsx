'use client'

import { sendQuestionReply } from '@/app/lib/actions/question/sendQuestionReply'
import { deleteQuestion } from '@/app/lib/actions/question/deleteQuestion'
import { markQuestionAsResponded } from '@/app/lib/actions/question/markQuestionAsResponded'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { DrawerShell } from '@/app/(authenticated)/v2/_components/DrawerShell'
import { FormError, FormField, FormTextarea } from '@/app/(authenticated)/v2/_components/FormField'
import { DrawerFormFooter } from '@/app/(authenticated)/v2/_components/DrawerFormFooter'
import {
  Callout,
  CharCount,
  ConfirmActionButton,
  DrawerActionButton,
  DrawerActions,
  DrawerBody,
  DrawerCloseFooter,
  MetaField,
  ReadonlyBlock,
  StatusBadge
} from '@/app/(authenticated)/v2/_components/DrawerElements'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { MailCheck, Trash2 } from 'lucide-react'
import { formatDate, formatTime } from '@/app/lib/utils/date.utils'

export function QuestionDrawer({
  question,
  onClose,
  onResponded,
  onDeleted
}: {
  question: IQuestion | null
  onClose: () => void
  onResponded: (id: string, reply?: string) => void
  onDeleted: (id: string) => void
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [markingResponded, setMarkingResponded] = useState(false)
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

  async function handleDelete() {
    if (!question) return
    setError(null)
    setDeleting(true)
    const result = await deleteQuestion(question.id)
    setDeleting(false)
    if (result.success) {
      deletedSE()
      onDeleted(question.id)
      onClose()
    } else {
      setError(result.error ?? 'Failed to delete this inquiry.')
    }
  }

  async function handleMarkAsResponded() {
    if (!question) return
    setError(null)
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

  const drawerLabel = question?.hasResponded ? 'Inquiry — Replied' : 'Inquiry — Needs reply'

  const done = !!(sentReply || question?.replyMessage || question?.hasResponded)

  return (
    <DrawerShell open={open} onClose={onClose} label={drawerLabel} width="w-[32rem]">
      {question && (
        <form onSubmit={handleSend} className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white text-sm">
          <DrawerBody>
            <div className="flex flex-col gap-3 pb-4 border-b border-neutral-200">
              <div className="flex items-start justify-between gap-4">
                <MetaField label="From">
                  <span className="font-semibold text-neutral-900 truncate">{question.name}</span>
                  <a
                    href={`mailto:${question.email}`}
                    className="text-blaze-text hover:underline truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
                  >
                    {question.email}
                  </a>
                </MetaField>

                <MetaField label="Received" align="right">
                  <span className="text-neutral-900 tabular-nums">{formatDate(question.createdAt)}</span>
                  <span className="text-neutral-500 tabular-nums">{formatTime(question.createdAt)}</span>
                </MetaField>
              </div>

              <StatusBadge tone={question.hasResponded ? 'emerald' : 'amber'}>
                {question.hasResponded ? 'Replied' : 'Awaiting reply'}
              </StatusBadge>
            </div>

            <ReadonlyBlock label="Message">{question.message}</ReadonlyBlock>

            {question.replyMessage ? (
              <ReadonlyBlock
                label="Reply sent"
                tone="emerald"
                meta={`${formatDate(question.updatedAt)} ${formatTime(question.updatedAt)}`}
              >
                {question.replyMessage}
              </ReadonlyBlock>
            ) : (
              <FormField label="Reply" htmlFor="question-reply">
                <FormTextarea
                  id="question-reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  rows={6}
                  maxLength={2000}
                />
                <CharCount value={reply.length} max={2000} warnAt={1800} />
              </FormField>
            )}

            {question.hasResponded && !question.replyMessage && (
              <Callout tone="emerald" icon={MailCheck}>
                Marked as responded. A reply may have been sent outside of this system.
              </Callout>
            )}

            <FormError error={error} />

            {emailFailed && (
              <Callout tone="amber">
                Reply saved, but the email failed to send. The response has been recorded, so send it manually if it matters.
              </Callout>
            )}

            <DrawerActions>
              {!question.hasResponded && (
                <DrawerActionButton
                  tone="emerald"
                  icon={MailCheck}
                  busy={markingResponded}
                  busyLabel="Marking..."
                  onClick={handleMarkAsResponded}
                >
                  Mark as responded
                </DrawerActionButton>
              )}

              <ConfirmActionButton
                tone="red"
                icon={Trash2}
                busy={deleting}
                busyLabel="Deleting..."
                question={`Delete this inquiry from ${question.name}?`}
                detail="It will be removed permanently. This cannot be undone."
                confirmLabel="Yes, delete it"
                onConfirm={handleDelete}
              >
                Delete inquiry
              </ConfirmActionButton>
            </DrawerActions>
          </DrawerBody>

          {done ? (
            <DrawerCloseFooter onClose={onClose} />
          ) : (
            <DrawerFormFooter onCancel={onClose} busy={sending} saving={sending} isEdit={false} submitLabel="Send reply" />
          )}
        </form>
      )}
    </DrawerShell>
  )
}
