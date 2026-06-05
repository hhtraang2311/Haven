type HavenLogoProps = {
  className?: string
}

export default function HavenLogo({ className = '' }: HavenLogoProps) {
  return (
    <h1 className={`haven-logo-text mx-auto w-fit text-center text-5xl font-extrabold ${className}`.trim()} style={{ letterSpacing: '-0.04em' }}>
      Ha
      <svg
        style={{ display: 'inline', verticalAlign: 'baseline', marginLeft: '-0.05em', marginRight: '-0.08em' }}
        width="0.65em"
        height="0.65em"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M32 56l-2.5-2.2C14.5 40.5 8 34 8 26c0-6.5 5-11.5 11-11.5 3.5 0 6.8 1.6 8.5 4.2l2.5 3.1 2.5-3.1c1.7-2.6 5-4.2 8.5-4.2 6 0 11 5 11 11.5 0 8-6.5 14.5-21.5 27.8L32 56z"
          fill="currentColor"
        />
      </svg>
      en
    </h1>
  )
}