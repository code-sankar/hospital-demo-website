const inputBase =
  'w-full rounded-none border-0 border-b border-stone-300 bg-transparent px-0 py-3 text-[0.9375rem] text-pine-900 placeholder:text-stone-400 transition-colors focus:border-pine-700 focus:outline-none focus:ring-0'

export function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow block text-pine-900/55">
      {children}
      {required && <span className="ml-1 text-clay-500">*</span>}
    </label>
  )
}

export function Input({ id, className = '', ...rest }) {
  return <input id={id} className={`${inputBase} ${className}`} {...rest} />
}

export function Textarea({ id, className = '', rows = 4, ...rest }) {
  return <textarea id={id} rows={rows} className={`${inputBase} resize-none ${className}`} {...rest} />
}

export function Select({ id, className = '', children, ...rest }) {
  return (
    <div className="relative">
      <select id={id} className={`${inputBase} appearance-none pr-8 ${className}`} {...rest}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-pine-700/60"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function FieldGroup({ label, htmlFor, required, hint, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-pine-900/45">{hint}</p>}
    </div>
  )
}
