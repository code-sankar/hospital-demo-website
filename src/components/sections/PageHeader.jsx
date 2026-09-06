import Container from '../ui/Container'
import Breadcrumbs from '../ui/Breadcrumbs'
import ArtPanel from '../art/ArtPanel'

/** The dark editorial masthead used by every interior page. */
export default function PageHeader({ eyebrow, title, lead, breadcrumbs, variant = 'colonnade', seed = 2, children }) {
  return (
    <section className="relative overflow-hidden bg-pine-900">
      <div className="absolute inset-0 opacity-55" aria-hidden="true">
        <ArtPanel variant={variant} tone="deep" seed={seed} arch={false} grid />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-r from-pine-900 via-pine-900/92 to-pine-900/50"
        aria-hidden="true"
      />

      <Container size="wide" className="relative">
        <div className="max-w-3xl py-16 sm:py-20 lg:py-24">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} inverted />}
          {eyebrow && <p className="eyebrow mt-8 text-brass-300">{eyebrow}</p>}
          <h1 className="mt-5 text-[2.4rem] leading-[1.06] text-ivory sm:text-[3.2rem] lg:text-[3.9rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-pine-100/72">{lead}</p>
          )}
          {children}
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brass-500/50 to-transparent" />
    </section>
  )
}
