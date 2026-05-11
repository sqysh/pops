import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export function FundCard({ fund }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-surface-dark border border-border-dark ${fund.border} transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden`}
    >
      {/* Colored top accent bar */}
      <div className={`h-0.5 w-full ${fund.top} shrink-0`} />

      {/* Card body */}
      <div className="flex-1 px-6 pt-6 pb-4 flex flex-col gap-4">
        {/* Label */}
        <span className={`text-[9px] font-mono uppercase tracking-[0.3em] ${fund.label_color}`}>{fund.label}</span>

        {/* Title */}
        <h2 className="font-changa font-black text-2xl 760:text-3xl text-text-dark leading-tight">
          {fund.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < fund.title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* Description */}
        <p className="font-lato text-text-dark/90 text-sm leading-relaxed">{fund.description}</p>

        {/* Sponsorship tiers */}
        {fund.tiers && (
          <div className="flex flex-col border-t border-border-dark pt-4 mt-1 gap-0">
            {fund.tiers.map(({ label, amount, note }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2.5 border-b border-border-dark/40 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-[12px] font-mono text-text-dark">{label}</span>
                  {note && <span className="text-[9px] font-mono text-muted-dark/70 italic">{note}</span>}
                </div>
                <span className={`text-base font-changa font-black tabular-nums shrink-0 ${fund.label_color}`}>
                  {amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Ad options */}
        {fund.adOptions && (
          <div className="flex flex-col border-t border-border-dark pt-4 mt-1 gap-0">
            {fund.adOptions.map(({ size, note, price }) => (
              <div
                key={size}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-border-dark/40 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-[12px] font-mono text-text-dark">{size}</span>
                  {note && <span className="text-[9px] font-mono text-muted-dark/70">{note}</span>}
                </div>
                <span className={`text-base font-changa font-black tabular-nums shrink-0 ${fund.label_color}`}>
                  {price}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom giving options */}
        {fund.extras && (
          <div className="flex flex-col border-t border-border-dark pt-4 mt-1 gap-2">
            {fund.extras.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-dark/40 shrink-0" />
                <span className="text-[12px] font-mono text-text-dark/90">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {fund.note && (
          <p className="text-[9px] font-mono text-muted-dark/70 leading-relaxed border-t border-border-dark pt-3 mt-1">
            {fund.note}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2 mt-auto">
        <a
          href={fund.href}
          target={fund.href.startsWith('mailto') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors duration-200 focus-visible:outline-none ${fund.btn}`}
        >
          {fund.cta}
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
        {!fund.href.startsWith('mailto') && (
          <p className="text-[8px] font-mono text-muted-dark/85 uppercase tracking-widest text-center">
            Secure · via CueBox
          </p>
        )}
      </div>
    </motion.div>
  )
}
