import { useState, useEffect, useCallback } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import Portrait from '../art/Portrait'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((dir) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 7000)
    return () => clearInterval(id)
  }, [paused, go])

  const active = testimonials[index]

  return (
    <section
      className="border-y border-stone-200 bg-parchment py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-brass-600">In their words</p>
            <span aria-hidden="true" className="mt-5 block h-px w-12 bg-brass-500/70" />
            <h2 className="mt-6 font-display text-[2rem] leading-tight text-pine-900 sm:text-[2.6rem]">
              The part of care that never shows up in an audit
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-pine-900/65">
              We publish our clinical outcomes annually. These are the things patients tell us instead.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex size-12 items-center justify-center border border-stone-300 text-pine-700 transition-colors hover:border-pine-700 hover:bg-pine-700 hover:text-ivory"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex size-12 items-center justify-center border border-stone-300 text-pine-700 transition-colors hover:border-pine-700 hover:bg-pine-700 hover:text-ivory"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="ml-3 font-display text-lg text-pine-900/45 tabular-nums">
                {String(index + 1).padStart(2, '0')}
                <span className="mx-1 text-pine-900/25">/</span>
                {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative border border-stone-200 bg-ivory p-8 shadow-card sm:p-12">
              <Quote className="size-9 text-brass-500/35" aria-hidden="true" />
              <blockquote className="mt-6 min-h-56 sm:min-h-48">
                <p
                  key={active.name}
                  className="animate-rise font-display text-[1.6rem] leading-[1.35] text-pine-900 sm:text-[2rem]"
                >
                  “{active.quote}”
                </p>
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-stone-200 pt-7">
                <span className="size-14 shrink-0 overflow-hidden rounded-full">
                  <Portrait seed={active.seed} showMonogram={false} name={active.name} />
                </span>
                <span>
                  <span className="block font-medium text-pine-900">{active.name}</span>
                  <span className="block text-[0.8125rem] text-pine-900/55">
                    {active.detail} · {active.location}
                  </span>
                </span>
              </figcaption>

              <div className="mt-8 flex gap-1.5" role="tablist" aria-label="Choose testimonial">
                {testimonials.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial from ${t.name}`}
                    onClick={() => setIndex(i)}
                    className={`h-0.5 flex-1 transition-colors duration-400 ${
                      i === index ? 'bg-pine-700' : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
