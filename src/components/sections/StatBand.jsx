import Container from '../ui/Container'
import Counter from '../ui/Counter'
import Reveal from '../ui/Reveal'
import ArtPanel from '../art/ArtPanel'
import { stats } from '../../data/site'

export default function StatBand() {
  return (
    <section className="relative overflow-hidden bg-pine-800 py-20 lg:py-24">
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <ArtPanel variant="colonnade" tone="deep" seed={6} arch={false} />
      </div>
      <div className="absolute inset-0 bg-hairline opacity-50" aria-hidden="true" />

      <Container size="wide" className="relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-brass-300">By the numbers</p>
          <h2 className="mt-6 font-display text-[2rem] leading-tight text-ivory sm:text-[2.6rem]">
            A century of continuous care, measured honestly
          </h2>
        </Reveal>

        <dl className="mt-14 grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="bg-pine-800 p-8 lg:p-9">
              <dd className="font-display text-[3.4rem] leading-none text-ivory">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-4 text-[0.9375rem] font-medium text-pine-100/85">{stat.label}</dt>
              <p className="mt-1.5 text-[0.75rem] text-pine-100/45">{stat.sub}</p>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
