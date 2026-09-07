import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function Accordion({ items, defaultOpen = null, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`divide-y divide-stone-200 border-y border-stone-200 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-pine-600"
              >
                <span className="font-display text-xl leading-snug text-pine-900 sm:text-[1.45rem]">
                  {item.q}
                </span>
                <span
                  className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'border-pine-700 bg-pine-700 text-ivory'
                      : 'border-stone-300 text-pine-700 group-hover:border-pine-700'
                  }`}
                >
                  {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            <div
              className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pr-14 pb-7 text-[0.9375rem] leading-relaxed text-pine-900/70">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
