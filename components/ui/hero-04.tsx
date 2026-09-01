'use client'

import * as React from 'react'
import Balancer from 'react-wrap-balancer'

import { cn } from '@/lib/utils'

import { Cta, type CtaProps } from '@/components/ui/hero-04-utils/cta'
import { ArtCollage } from '@/components/ui/hero-04-utils/art-collage'

export interface Hero04Props {
  title: string
  washImage?: string
  titleLine2?: string
  description: string
  primaryImage: string
  secondaryImage: string
  primaryAlt?: string
  secondaryAlt?: string
  animation?: 'none' | 'subtle'
  primaryCTA: CtaProps
  secondaryCTA?: CtaProps
  variant?: 'standard' | 'compact'
}

const variantStyles = {
  standard: {
    section: 'py-20 sm:py-28',
    title: 'text-3xl sm:text-4xl md:text-5xl',
    description: 'max-w-md text-sm sm:text-base',
    header: 'gap-5',
    grid: 'gap-12 lg:gap-16',
  },
  compact: {
    section: 'py-14 sm:py-20',
    title: 'text-2xl sm:text-3xl md:text-4xl',
    description: 'max-w-sm text-sm',
    header: 'gap-4',
    grid: 'gap-10 lg:gap-12',
  },
} as const

// Lightweight scroll-reveal: plain IntersectionObserver + CSS transitions
// instead of `motion` (framer-motion), which shipped ~76KiB of mostly
// unused JS for a single fade-in effect and was never fully stable here.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return reduced
}

function useInView(active: boolean) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [active])

  return { ref, inView }
}

function Reveal({
  active,
  delayMs = 0,
  distance = 12,
  blur = 6,
  className,
  children,
}: Readonly<{
  active: boolean
  delayMs?: number
  distance?: number
  blur?: number
  className?: string
  children: React.ReactNode
}>) {
  const { ref, inView } = useInView(active)

  if (!active) return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      className={cn(
        className,
        'transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        !inView && 'pointer-events-none',
      )}
      style={{
        transitionDelay: `${delayMs}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateY(${distance}px)`,
        filter: inView ? 'blur(0px)' : `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  )
}

export function Hero04({
  title,
  titleLine2,
  description,
  washImage,
  primaryImage,
  secondaryImage,
  primaryAlt = '',
  secondaryAlt = '',
  animation = 'none',
  primaryCTA,
  secondaryCTA,
  variant = 'standard',
}: Readonly<Hero04Props>) {
  const reduce = usePrefersReducedMotion()
  const animate = animation === 'subtle' && !reduce
  const vs = variantStyles[variant]

  const backgroundElement = washImage && (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 aspect-2/3 mask-radial-[75%_100%] mask-radial-from-45% mask-radial-to-75% mask-radial-at-top opacity-75 blur-xl md:aspect-square lg:aspect-video dark:opacity-5"
    >
      <img
        src={washImage}
        alt=""
        className="h-full w-full object-cover object-top"
      />
    </div>
  )

  const titleElement = title && (
    <h1
      className={cn(
        'text-foreground font-serif font-normal tracking-tight text-balance',
        vs.title,
      )}
    >
      <Balancer>{title}</Balancer>
      {titleLine2 && (
        <>
          <br />
          <Balancer>{titleLine2}</Balancer>
        </>
      )}
    </h1>
  )

  const descriptionElement = description && (
    <p className={cn('text-muted-foreground', vs.description)}>
      <Balancer>{description}</Balancer>
    </p>
  )

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? 'link' }}
        />
      )}
    </div>
  )

  const mediaElement = (
    <ArtCollage
      primaryImage={primaryImage}
      secondaryImage={secondaryImage}
      primaryAlt={primaryAlt}
      secondaryAlt={secondaryAlt}
    />
  )

  return (
    <section className="bg-background relative isolate w-full overflow-hidden">
      {backgroundElement}

      <div
        className={cn(
          'relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center px-6 lg:grid-cols-2',
          vs.section,
          vs.grid,
        )}
      >
        <Reveal
          active={animate}
          className={cn('flex flex-col items-start', vs.header)}
        >
          {titleElement}
          {descriptionElement}
          {ctasElement}
        </Reveal>

        <Reveal
          active={animate}
          delayMs={150}
          distance={24}
          blur={8}
          className="w-full"
        >
          {mediaElement}
        </Reveal>
      </div>
    </section>
  )
}

export default Hero04;
