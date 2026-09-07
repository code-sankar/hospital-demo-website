export default function Container({ as: As = 'div', size = 'default', className = '', children }) {
  const sizes = {
    tight: 'max-w-3xl',
    narrow: 'max-w-5xl',
    default: 'max-w-7xl',
    wide: 'max-w-[88rem]',
  }
  return <As className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${sizes[size]} ${className}`}>{children}</As>
}
