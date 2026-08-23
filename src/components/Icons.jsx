const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HeartIcon({ filled, ...props }) {
  return (
    <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20.5s-7.5-4.6-10-9.4C.4 7.6 2 4 5.6 3.4 8 3 10.3 4.3 12 6.6 13.7 4.3 16 3 18.4 3.4 22 4 23.6 7.6 22 11.1 19.5 15.9 12 20.5 12 20.5Z" />
    </svg>
  )
}

export function CommentIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 9 9 0 0 1-3.1-.6L3 21l1.8-5.4A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
    </svg>
  )
}

export function RepostIcon({ active, ...props }) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v9a3 3 0 0 0 3 3h9" />
      <path d="M15.5 13 18 16l2.5-3" />
      <path d="M18 20v-9a3 3 0 0 0-3-3H6" />
      <path d="M8.5 11 6 8 3.5 11" />
    </svg>
  )
}

export function ShareIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12 15-8-6 16-3-6-6-2Z" />
    </svg>
  )
}

export function HomeIcon({ active, ...props }) {
  return (
    <svg {...base} {...props} fill={active ? 'currentColor' : 'none'}>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.3-4.3" />
    </svg>
  )
}

export function ComposeIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function ActivityIcon({ active, ...props }) {
  return (
    <svg {...base} {...props} fill={active ? 'currentColor' : 'none'}>
      <path d="M12 20.5s-7.5-4.6-10-9.4C.4 7.6 2 4 5.6 3.4 8 3 10.3 4.3 12 6.6 13.7 4.3 16 3 18.4 3.4 22 4 23.6 7.6 22 11.1 19.5 15.9 12 20.5 12 20.5Z" />
    </svg>
  )
}

export function MoreIcon(props) {
  return (
    <svg {...base} {...props} strokeWidth={2.4} fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  )
}

export function VerifiedIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...props}>
      <path
        fill="#3b9eff"
        d="M12 2 14.5 4.2 17.8 3.8 18.6 7 21.6 8.6 20.6 12 21.6 15.4 18.6 17 17.8 20.2 14.5 19.8 12 22 9.5 19.8 6.2 20.2 5.4 17 2.4 15.4 3.4 12 2.4 8.6 5.4 7 6.2 3.8 9.5 4.2 12 2Z"
      />
      <path fill="#fff" d="m9 12.3 2.1 2.1 4-4.2" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  )
}

export function UserPlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3.5 20c.7-3.4 3.2-5.5 6-5.5s5.3 2.1 6 5.5" />
      <path d="M18.5 8.5v5M16 11h5" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  )
}
