'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft, Music, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { containerVariants, itemVariants } from './lib/constants/motion'

const Pops404 = () => {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="relative">
        <motion.div
          className="relative z-10 text-center max-w-[320px] 430:max-w-lg mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Icon */}
          <motion.div className="mb-8 flex justify-center" variants={itemVariants} aria-hidden="true">
            <div className="w-16 h-16 border border-blaze/30 bg-blaze/10 flex items-center justify-center">
              <Music className="w-7 h-7 text-blaze-text" />
            </div>
          </motion.div>

          {/* 404 */}
          <motion.div className="mb-4" variants={itemVariants}>
            <span
              className="font-changa text-[6rem] 430:text-[8rem] leading-none text-white/10 block"
              aria-hidden="true"
            >
              404
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex items-center gap-3 430:gap-4 justify-center mb-4">
              <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
              <h1 className="font-changa text-2xl 430:text-3xl text-white leading-tight">
                This Page Has Left the Stage
              </h1>
              <div className="w-8 430:w-12 h-px bg-blaze shrink-0" aria-hidden="true" />
            </div>
            <div className="w-12 h-px bg-blaze mx-auto mb-6" aria-hidden="true" />
            <p className="font-lato text-sm 430:text-base text-white/50 leading-relaxed max-w-sm mx-auto border-l-2 border-blaze pl-5 text-left">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the
              performance.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col 430:flex-row gap-3 justify-center items-center mb-10"
            variants={itemVariants}
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 bg-blaze hover:bg-blazehover text-white px-8 py-4 font-changa text-xs uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full 430:w-auto"
            >
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Return Home</span>
              <ArrowRightIcon
                className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/concerts"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-blaze/50 hover:bg-blaze/5 text-white/70 hover:text-white px-8 py-4 font-changa text-xs uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full 430:w-auto"
            >
              <Music className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>View Concerts</span>
            </Link>
          </motion.div>

          {/* Back */}
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 font-changa text-xs uppercase tracking-[0.25em] text-white/50 hover:text-blaze-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Credits */}
          <motion.div className="mt-12 pt-6 border-t border-white/10" variants={itemVariants}>
            <p className="font-lato text-[11px] uppercase tracking-widest text-white/40">
              © {new Date().getFullYear()} The Pops Orchestra of Sarasota and Bradenton
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

export default Pops404
