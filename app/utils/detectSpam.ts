const SPAM_CATEGORIES = [
  {
    name: 'financial_promise',
    patterns: [
      /earnings/i,
      /credits/i,
      /transfer/i,
      /funds/i,
      /cashback/i,
      /rebate/i,
      /voucher/i,
      /incentive/i,
      /reward/i,
      /asset/i
    ]
  },
  {
    name: 'fake_urgency',
    patterns: [
      /urgent/i,
      /immediately/i,
      /expires?/i,
      /deadline/i,
      /limited time/i,
      /act (fast|now)/i,
      /before.*gone/i,
      /midnight/i
    ]
  },
  {
    name: 'elite_access',
    patterns: [
      /platinum/i,
      /elite/i,
      /exclusive/i,
      /vip/i,
      /premium/i,
      /insider/i,
      /hidden/i,
      /secret/i,
      /dormant/i,
      /vault/i
    ]
  },
  {
    name: 'action_required',
    patterns: [
      /initiate/i,
      /validate/i,
      /confirm/i,
      /submit.*details/i,
      /finalize/i,
      /retrieve/i,
      /unlock/i,
      /claim/i,
      /activate/i
    ]
  },
  {
    name: 'solicitation',
    patterns: [
      /franchise/i,
      /SEO/i,
      /leads/i,
      /marketing services/i,
      /business opportunity/i,
      /partnership/i,
      /investment/i,
      /ahead of competitors/i,
      /place your company/i,
      /see it live within/i,
      /rank (higher|better|faster)/i,
      /dominate search/i,
      /boost your (rankings|visibility|traffic)/i,
      /business development/i,
      /sales rep/i
    ]
  },
  {
    name: 'technical_impersonation',
    patterns: [
      /system alert/i,
      /automated system/i,
      /digital profile/i,
      /contact record/i,
      /identity confirmation/i,
      /account flagged/i
    ]
  },
  {
    name: 'offshore_financial',
    patterns: [/offshore/i, /crypto/i, /affiliate earnings/i, /income channel/i, /access credentials/i]
  },
  {
    name: 'local_solicitation',
    patterns: [
      /i work in (sarasota|bradenton|your area|the area)/i,
      /local (companies|businesses|clients)/i,
      /come by and/i,
      /complimentary (bid|quote|cleaning|consultation)/i,
      /business development/i
    ]
  }
]

const HIGH_CONFIDENCE_PATTERNS = [
  /offshore/i,
  /confidential transfer/i,
  /identity confirmation/i,
  /submit.*details immediately/i,
  /!{3,}/,
  /asset vault/i,
  /dormant.*asset/i,
  /reply stop to unsubscribe/i,
  /reply stop/i,
  /to unsubscribe/i,
  /per keyword/i,
  /starting from (usd|\\$)/i,
  /affordable (seo|marketing|plans)/i,
  /improve (your )?(online visibility|search rankings)/i,
  /recently reached out/i,
  /respond with stop/i,
  /to opt.?out/i,
  /complimentary (cleaning|quote|bid|consultation|assessment|estimate)/i,
  /cleaning bid/i,
  /business development rep/i,
  /come by and/i,
  /hoping (i could|we could)/i
]

export function detectSpam(text: string): boolean {
  // Instant flag on high confidence
  if (HIGH_CONFIDENCE_PATTERNS.some((p) => p.test(text))) return true

  // Flag if 2+ categories match
  const categoryHits = SPAM_CATEGORIES.filter(({ patterns }) => patterns.some((p) => p.test(text)))
  return categoryHits.length >= 2
}
