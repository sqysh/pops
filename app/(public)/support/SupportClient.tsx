'use client'

import Breadcrumb from '@/app/components/common/Breadcrumb'
import Picture from '@/app/components/common/Picture'
import { useRotatingImageText } from '@/app/lib/hooks/useRotatingImageText'

const chairSponsorshipData = [
  {
    image: '/images/cs-1.jpg',
    title: 'Affordable Tickets',
    text: 'With your support we are able to present national talents and produce exhilarating, crowd-pleasing entertainment for those on fixed incomes and tight budgets.'
  },
  {
    image: '/images/cs-2.jpg',
    title: 'Pops Musicians',
    text: 'Professional and avocational musicians of all ages are rewarded for their dedication of time and talents. Your support helps us offer some remuneration to every musician.'
  },
  {
    image: '/images/cs-3.jpg',
    title: 'Student Experiences',
    text: 'Not every deserving student gets a chance to perform in an orchestra. With your help we will be expanding our capacity to serve more youth through a Bradenton-based youth orchestra program.'
  },
  {
    image: '/images/cs-4.jpg',
    title: 'Community at Large',
    text: 'Our musicians, if not the full orchestra, frequently perform in the community in special events for veterans, seniors, and in collaboration with various other local arts initiatives.'
  }
]

export const SupportClient = ({ data }) => {
  const { currentItem, fade } = useRotatingImageText(chairSponsorshipData)
  const field = (id: string) => data?.content?.find((item) => item.id === id)?.value ?? ''

  const tableRows = [
    {
      label: field('chair_table_row_conductor_label'),
      bronze: field('chair_table_row_conductor_bronze'),
      silver: field('chair_table_row_conductor_silver'),
      gold: field('chair_table_row_conductor_gold'),
      platinum: field('chair_table_row_conductor_platinum')
    },
    {
      label: field('chair_table_row_concertmaster_label'),
      bronze: field('chair_table_row_concertmaster_bronze'),
      silver: field('chair_table_row_concertmaster_silver'),
      gold: field('chair_table_row_concertmaster_gold'),
      platinum: field('chair_table_row_concertmaster_platinum')
    },
    {
      label: field('chair_table_row_principal_label'),
      bronze: field('chair_table_row_principal_bronze'),
      silver: field('chair_table_row_principal_silver'),
      gold: field('chair_table_row_principal_gold'),
      platinum: field('chair_table_row_principal_platinum')
    },
    {
      label: field('chair_table_row_section_label'),
      bronze: field('chair_table_row_section_bronze'),
      silver: field('chair_table_row_section_silver'),
      gold: field('chair_table_row_section_gold'),
      platinum: field('chair_table_row_section_platinum')
    }
  ]

  return (
    <main id="main-content">
      <Breadcrumb breadcrumb="Chair Sponsorships" />

      <div className="relative bg-black">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: `url('/images/bio-bg.webp')`, backgroundAttachment: 'fixed' }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 990:px-12 xl:px-4">
          <div className="max-w-[320px] 430:max-w-130 760:max-w-xl 990:max-w-200 1200:max-w-screen-1160 1590:max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="w-full text-center flex flex-col items-center pt-32 pb-20 border-b border-white/10">
              <p className="font-changa text-xs uppercase tracking-[0.3em] text-blaze-text mb-4">The Pops Orchestra</p>
              <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                <h1 className="text-4xl 430:text-5xl sm:text-6xl font-changa text-white leading-none">
                  Chair Sponsorships
                </h1>
                <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
              </div>
              <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
              <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed">
                {field('chair_hero_paragraph_1')}
              </p>
            </header>

            {/* Hero section */}
            <section aria-labelledby="chair-hero-heading" className="py-20 990:py-32">
              <div className="grid grid-cols-1 1200:grid-cols-2 gap-px bg-white/10">
                {/* Image */}
                <div className="bg-black overflow-hidden">
                  <Picture
                    src="/images/mcs.png"
                    alt="Musician Chair Sponsorships collage"
                    priority={true}
                    className="w-full h-full object-cover aspect-video 1200:aspect-square"
                  />
                </div>

                {/* Content */}
                <div className="bg-black p-7 430:p-10 990:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-px bg-blaze" aria-hidden="true" />
                    <span className="font-changa text-xs uppercase tracking-[0.25em] text-blaze-text">About</span>
                  </div>
                  <h2
                    id="chair-hero-heading"
                    className="font-changa text-3xl 430:text-4xl text-white leading-tight mb-4"
                  >
                    {field('chair_hero_heading')}
                  </h2>
                  <div className="w-8 h-px bg-blaze mb-6" aria-hidden="true" />
                  <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed mb-4 border-l-2 border-blaze pl-5">
                    {field('chair_hero_paragraph_1')}
                  </p>
                  <p className="font-lato text-white/60 text-sm 430:text-base leading-relaxed mb-10">
                    {field('chair_hero_paragraph_2')}
                  </p>
                </div>
              </div>
            </section>

            {/* Levels + table */}
            <section aria-labelledby="chair-levels-heading" className="pb-20 990:pb-32">
              <div className="flex flex-col items-center text-center mb-12 430:mb-16">
                <p className="font-changa text-xs uppercase tracking-[0.3em] text-blaze-text mb-4">Giving Levels</p>
                <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                  <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                  <h2 id="chair-levels-heading" className="font-changa text-3xl 430:text-4xl text-white leading-none">
                    {field('chair_levels_heading')}
                  </h2>
                  <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                </div>
                <div className="w-16 h-px bg-blaze mx-auto mt-2 mb-6" aria-hidden="true" />
                <p className="font-lato text-white/50 text-sm 430:text-base max-w-xl leading-relaxed">
                  {field('chair_levels_description')}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-lato min-w-125">
                  <caption className="sr-only">Chair sponsorship levels and pricing by role</caption>
                  <thead>
                    <tr className="border-b-2 border-blaze">
                      <th
                        scope="col"
                        className="py-4 px-4 430:px-5 text-left font-changa text-xs uppercase tracking-[0.25em] text-white/60"
                      />
                      {[
                        field('chair_table_col_bronze'),
                        field('chair_table_col_silver'),
                        field('chair_table_col_gold'),
                        field('chair_table_col_platinum')
                      ].map((col, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="py-4 px-4 430:px-5 font-changa text-xs uppercase tracking-[0.25em] text-blaze-text text-center"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {tableRows.map((row, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                        <th
                          scope="row"
                          className="py-4 px-4 430:px-5 text-left font-lato text-xs 430:text-sm text-white/70 font-normal"
                        >
                          {row.label}
                        </th>
                        <td className="py-4 px-4 430:px-5 text-center font-lato text-xs 430:text-sm text-white/60">
                          {row.bronze}
                        </td>
                        <td className="py-4 px-4 430:px-5 text-center font-lato text-xs 430:text-sm text-white/60">
                          {row.silver}
                        </td>
                        <td className="py-4 px-4 430:px-5 text-center font-lato text-xs 430:text-sm text-white/60">
                          {row.gold}
                        </td>
                        <td className="py-4 px-4 430:px-5 text-center font-lato text-xs 430:text-sm text-white/60">
                          {row.platinum}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Community carousel */}
            <section aria-labelledby="chair-community-heading" className="pb-28 990:pb-40">
              <div className="flex flex-col items-center text-center mb-12 430:mb-16">
                <p className="font-changa text-xs uppercase tracking-[0.3em] text-blaze-text mb-4">Community</p>
                <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
                  <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                  <h2
                    id="chair-community-heading"
                    className="font-changa text-3xl 430:text-4xl text-white leading-none"
                  >
                    {field('chair_community_heading')}
                  </h2>
                  <div className="w-8 430:w-16 h-px bg-blaze shrink-0" aria-hidden="true" />
                </div>
                <div className="w-16 h-px bg-blaze mx-auto mt-2" aria-hidden="true" />
              </div>

              <div className="flex items-center justify-center">
                <div
                  className={`transition-opacity duration-1000 ease-in-out flex flex-col items-center max-w-xl ${
                    fade ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="border border-white/10 border-t-2 border-t-blaze overflow-hidden mb-6">
                    <Picture
                      src={currentItem.image}
                      alt={currentItem.title}
                      priority={false}
                      className="w-72 430:w-80 h-auto aspect-square object-cover"
                    />
                  </div>
                  <p className="font-changa text-2xl 430:text-3xl text-white mb-3">{currentItem.title}</p>
                  <div className="w-8 h-px bg-blaze mb-4" aria-hidden="true" />
                  <p className="font-lato text-white/60 text-sm 430:text-base text-center leading-relaxed">
                    {currentItem.text}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
