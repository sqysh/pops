'use client'

import { useEffect, useId, useRef, useState } from 'react'

export const SqyshMascot = ({ size = 130, onBoop }: { size?: number; onBoop?: () => void }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const pupilsRef = useRef<SVGGElement | null>(null)
  const boopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gradId = useId()
  const [booped, setBooped] = useState(false)

  // Boop with cleanup
  const boop = () => {
    if (booped) return
    setBooped(true)
    onBoop?.()
    boopTimeoutRef.current = setTimeout(() => setBooped(false), 700)
  }

  useEffect(() => {
    return () => {
      if (boopTimeoutRef.current) clearTimeout(boopTimeoutRef.current)
    }
  }, [])

  return (
    <button
      onClick={boop}
      aria-label="Sqysh says hi"
      className="bg-transparent border-none p-0 cursor-pointer select-none"
    >
      <style>{`
        .sq-mascot .tent {
          transform-box: fill-box;
          transform-origin: 50% 10%;
          animation: sqm-sway 1.6s ease-in-out infinite;
        }
        .sq-mascot .t1 { animation-delay: 0s; }
        .sq-mascot .t2 { animation-delay: 0.18s; }
        .sq-mascot .t3 { animation-delay: 0.36s; }
        .sq-mascot .t4 { animation-delay: 0.54s; }
        .sq-mascot .eyes {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: sqm-blink 4s infinite;
        }
        .sq-mascot .pupils { transition: transform 0.15s ease-out; }
        .sq-mascot .pupils.glancing { animation: none; }
        .sq-mascot:not(.tracking) .pupils { animation: sqm-look 5s ease-in-out infinite; }
        .sq-mascot .bod { animation: sqm-bob 2.6s ease-in-out infinite; }
        .sq-mascot.startled .eyes { animation: sqm-startle 0.4s ease-out; }
        .sq-mascot.booped .bod { animation: sqm-boop 0.7s ease-out; }
        .sq-mascot.booped .tent { animation-duration: 0.4s; }

        @keyframes sqm-startle {
          0% { transform: scaleY(1); }
          20% { transform: scaleY(0.06); }
          45% { transform: scaleY(1.12); }
          100% { transform: scaleY(1); }
        }
        @keyframes sqm-sway {
          0%, 100% { transform: rotate(-3deg) scaleY(1); }
          50% { transform: rotate(3deg) scaleY(1.05); }
        }
        @keyframes sqm-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          93%, 97% { transform: scaleY(0.06); }
        }
        @keyframes sqm-look {
          0%, 22% { transform: translateX(0); }
          32%, 48% { transform: translateX(-7px); }
          58%, 80% { transform: translateX(7px); }
          90%, 100% { transform: translateX(0); }
        }
        @keyframes sqm-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes sqm-boop {
          0% { transform: scale(1, 1); }
          25% { transform: scale(1.12, 0.85); }
          50% { transform: scale(0.94, 1.08); }
          75% { transform: scale(1.04, 0.97); }
          100% { transform: scale(1, 1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sq-mascot .tent, .sq-mascot .eyes, .sq-mascot .pupils, .sq-mascot .bod {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <svg
        ref={svgRef}
        className={`sq-mascot ${booped ? 'booped' : ''} filter-[drop-shadow(0_0_6px_rgba(255,41,82,0.55))_drop-shadow(0_0_16px_rgba(255,41,82,0.35))]`}
        width={size}
        height={size * 1.08}
        viewBox="0 0 240 258"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="170"
            y2="170"
            spreadMethod="repeat"
          >
            <stop offset="0" className="[stop-color:#ff4d6d]" />
            <stop offset="0.5" className="[stop-color:#ff2952]" />
            <stop offset="1" className="[stop-color:#ff4d6d]" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0 0"
              to="170 170"
              dur="5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <g className="bod" style={{ transformBox: 'fill-box', transformOrigin: '50% 60%' }}>
          {/* Tentacle lobes — rounded sides, exact bottom curves from the mark */}
          <g className="tent t1">
            <path
              d="M 45 175 C 40 200, 64 222, 83 200 C 87 184, 87 166, 85 150 L 52 150 C 46 158, 45 166, 45 175 Z"
              fill={`url(#${gradId})`}
            />
          </g>
          <g className="tent t2">
            <path
              d="M 83 200 C 90 226, 114 228, 122 202 C 125 185, 125 167, 123 150 L 82 150 C 80 167, 80 184, 83 200 Z"
              fill={`url(#${gradId})`}
            />
          </g>
          <g className="tent t3">
            <path
              d="M 122 202 C 130 228, 154 226, 161 200 C 163 184, 163 167, 161 150 L 121 150 C 119 167, 119 185, 122 202 Z"
              fill={`url(#${gradId})`}
            />
          </g>
          <g className="tent t4">
            <path
              d="M 161 200 C 180 222, 200 200, 195 175 C 195 166, 193 158, 188 150 L 159 150 C 157 166, 157 184, 161 200 Z"
              fill={`url(#${gradId})`}
            />
          </g>

          {/* Body dome */}
          <path
            d="M 30 100 C 30 50, 70 30, 120 30 C 170 30, 210 50, 210 100 C 210 128, 206 152, 197 170 C 150 184, 90 184, 43 170 C 34 152, 30 128, 30 100 Z"
            fill={`url(#${gradId})`}
          />

          {/* Eyes */}
          <g className="eyes">
            <g ref={pupilsRef} className="pupils">
              <ellipse cx="85" cy="105" rx="13" ry="17" fill="#0F1115" />
              <ellipse cx="155" cy="105" rx="13" ry="17" fill="#0F1115" />
              <ellipse cx="82" cy="99" rx="3" ry="4.5" fill="#FFFFFF" />
              <ellipse cx="152" cy="99" rx="3" ry="4.5" fill="#FFFFFF" />
            </g>
          </g>
        </g>
      </svg>
    </button>
  )
}
