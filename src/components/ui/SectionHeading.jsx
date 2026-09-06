import Reveal from './Reveal'

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  inverted = false,
  className = '',
  children,
}) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span className={`eyebrow ${inverted ? 'text-brass-300' : 'text-brass-600'}`}>{eyebrow}</span>
      )}
      <span
        aria-hidden="true"
        className={`mt-5 block h-px w-12 ${inverted ? 'bg-brass-300/60' : 'bg-brass-500/70'} ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
      {title && (
        <h2
          className={`mt-6 text-[2rem] leading-[1.08] sm:text-[2.6rem] lg:text-[3.1rem] ${
            inverted ? 'text-ivory' : 'text-pine-900'
          }`}
        >
          {title}
        </h2>
      )}
      {lead && (
        <p
          className={`mt-5 text-[1.0625rem] leading-relaxed ${
            inverted ? 'text-pine-100/75' : 'text-pine-900/68'
          }`}
        >
          {lead}
        </p>
      )}
      {children}
    </Reveal>
  )
}
