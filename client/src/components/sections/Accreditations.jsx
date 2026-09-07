import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { accreditations } from '../../data/site'

export default function Accreditations() {
  return (
    <section className="border-b border-stone-200 bg-ivory py-14">
      <Container size="wide">
        <Reveal className="flex flex-col gap-2 text-center">
          <p className="eyebrow text-pine-900/40">Accredited, inspected and independently verified</p>
        </Reveal>

        <ul className="mt-10 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {accreditations.map((a, i) => (
            <Reveal
              key={a.short}
              delay={i * 0.05}
              className="group flex flex-col items-center justify-center gap-2 bg-ivory px-5 py-8 text-center transition-colors hover:bg-parchment"
            >
              <span className="font-display text-2xl tracking-[0.14em] text-pine-800">{a.short}</span>
              <span className="text-[0.6875rem] leading-snug font-medium tracking-wide text-pine-900/55">
                {a.name}
              </span>
              <span className="text-[0.625rem] leading-snug text-pine-900/35">{a.note}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
