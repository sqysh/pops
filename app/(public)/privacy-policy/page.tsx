import Breadcrumb from '@/app/components/common/Breadcrumb'

const PrivacyPolicy = () => {
  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Privacy Policy" />

      <div className="relative">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 990:px-12 xl:px-4">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 mx-auto">
            {/* Page Header */}
            <header className="w-full text-center flex flex-col items-center pt-32 pb-20 border-b border-white/10">
              <p className="font-changa text-sm uppercase tracking-[0.3em] text-blaze-text mb-4">The Pops Orchestra</p>
              <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">
                  Privacy Policy
                </h1>
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              </div>
              <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
              <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed">
                At The Pops Orchestra, we keep things simple. This policy explains how we handle any information you
                share with us through our website.
              </p>
            </header>

            {/* Content */}
            <article aria-labelledby="privacy-policy-heading" className="py-20 pb-32 max-w-3xl flex flex-col gap-10">
              <h2 id="privacy-policy-heading" className="sr-only">
                Privacy Policy Details
              </h2>

              <section aria-labelledby="who-we-are">
                <h2 id="who-we-are" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Who We Are
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  We&apos;re The Pops Orchestra of Bradenton and Sarasota, and our website is{' '}
                  <a
                    href="https://thepopsorchestra.org"
                    className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                  >
                    https://thepopsorchestra.org
                  </a>
                  . Our site was built by{' '}
                  <a
                    href="https://sqysh.io?lead_source=the_pops_orchestra"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Sqysh (opens in new tab)"
                    className="text-lime-400 underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm"
                  >
                    Sqysh
                  </a>
                  , who helps us maintain a secure and user-friendly experience.
                </p>
              </section>

              <section aria-labelledby="forms-heading">
                <h2 id="forms-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  When You Fill Out Our Forms
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  We have a few contact forms on our website where you can reach out to us with questions, requests, or
                  to get more information about our orchestra. When you fill these out, we collect basic information
                  like your name, email address, and your message. We use this information solely to get back to you —
                  that&apos;s it!
                </p>
              </section>

              <section aria-labelledby="what-we-dont-do-heading">
                <h2 id="what-we-dont-do-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  What We Don&apos;t Do
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <ul
                  role="list"
                  aria-label="Things we don't do with your information"
                  className="flex flex-col divide-y divide-white/10"
                >
                  {[
                    "We don't sell your information to anyone",
                    "We don't share your details with third parties",
                    "We don't send spam or unwanted emails",
                    "We don't require you to create accounts or log in"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blaze mt-2 shrink-0" aria-hidden="true" />
                      <span className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="tickets-heading">
                <h2 id="tickets-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Tickets &amp; Events
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  When you&apos;re ready to buy tickets for our concerts, you&apos;ll be directed to AudienceView, our
                  ticketing partner. Any ticket purchases happen on their secure platform, not ours. Check out their
                  privacy policy for details on how they handle your purchase information.
                </p>
              </section>

              <section aria-labelledby="website-basics-heading">
                <h2 id="website-basics-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Website Basics
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  Like most websites, ours automatically collects some basic information like your browser type and
                  which pages you visit. This helps us understand how people use our site and make it better. We also
                  use simple cookies to remember your preferences and make sure our forms work properly.
                </p>
              </section>

              <section aria-labelledby="photos-heading">
                <h2 id="photos-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Photos at Our Concerts
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  We love capturing the joy at our performances! We sometimes take photos and videos at concerts to
                  share on our website and social media. If you&apos;d prefer not to be included, just let our
                  volunteers know at the event.
                </p>
              </section>

              <section aria-labelledby="security-heading">
                <h2 id="security-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Keeping Things Secure
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  We take reasonable steps to protect any information you share with us. Our website uses secure
                  connections, and only a few orchestra administrators have access to form submissions.
                </p>
              </section>

              <section aria-labelledby="questions-heading">
                <h2 id="questions-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Your Questions &amp; Requests
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  If you have questions about this policy, want to know what information we have about you, or would
                  like us to delete your contact details, just reach out! You can contact us at{' '}
                  <a
                    href="mailto:info@thepopsorchestra.org"
                    aria-label="Email us at info@thepopsorchestra.org"
                    className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                  >
                    info@thepopsorchestra.org
                  </a>{' '}
                  or call us at{' '}
                  <a
                    href="tel:941-926-7677"
                    aria-label="Call us at 941-926-POPS"
                    className="text-sunburst underline hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunburst rounded-sm"
                  >
                    (941) 926-POPS
                  </a>
                  .
                </p>
              </section>

              <section aria-labelledby="updates-heading">
                <h2 id="updates-heading" className="font-changa text-xl 430:text-2xl text-white mb-4">
                  Updates
                </h2>
                <div className="w-8 h-px bg-blaze mb-5" aria-hidden="true" />
                <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed">
                  If we ever need to update this policy, we&apos;ll post the changes here. Since we keep things pretty
                  simple, we don&apos;t expect many changes!
                </p>
              </section>

              <p className="font-lato text-white/50 text-sm border-t border-white/10 pt-6">
                <time dateTime={new Date().toISOString().split('T')[0]}>
                  Last updated: {new Date().toLocaleDateString()}
                </time>
              </p>
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy
