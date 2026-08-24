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

export function BackIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m11 5-7 7 7 7M4.5 12h15" />
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

export function GearIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 6.14 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 1 1 8.57 4.24l.06.06a1.7 1.7 0 0 0 1.87.34H10.6A1.7 1.7 0 0 0 11.6 3v-.09a2 2 0 1 1 4 0V3a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  )
}

export function BookmarkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5-7 4.5V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function SlidersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 6h9M18 6h1M5 18h1M8 18h11M5 12h4M13 12h6" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="11" cy="18" r="2" />
    </svg>
  )
}

export function PersonCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M5.8 18.4a6.7 6.7 0 0 1 12.4 0" />
    </svg>
  )
}

export function ShareUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6" />
    </svg>
  )
}

export function HelpCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.7 2.7 0 1 1 4 2.3c-.8.5-1.3.9-1.3 2" />
      <circle cx="12" cy="16.7" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function InfoCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.6" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function SwitchAccountIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M17 2.5 20.5 6 17 9.5" />
      <path d="M20.5 6H9a5 5 0 0 0-5 5" />
      <path d="M7 21.5 3.5 18 7 14.5" />
      <path d="M3.5 18H15a5 5 0 0 0 5-5" />
    </svg>
  )
}

export function PersonIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1-4 3.9-6.3 7.5-6.3S18.5 16 19.5 20" />
    </svg>
  )
}

export function BellIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10.5a6 6 0 0 1 12 0c0 4 1.3 5.4 2 6.3H4c.7-.9 2-2.3 2-6.3Z" />
      <path d="M10.3 19.5a2 2 0 0 0 3.4 0" />
    </svg>
  )
}

export function HistoryIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M3.5 3.5v4h4" />
      <path d="M12 8.5v4l3 2" />
    </svg>
  )
}

export function SendIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12 15-8-6 16-3-6-6-2Z" />
      <path d="M13 11 8.5 15.5" />
    </svg>
  )
}

export function MessageCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5c-5 0-9 3.4-9 7.6 0 2.5 1.4 4.7 3.6 6.1-.1 1.1-.5 2.2-1.3 3.2 1.5-.2 2.9-.8 4.1-1.7.8.2 1.7.3 2.6.3 5 0 9-3.4 9-7.6s-4-7.9-9-7.9Z" />
    </svg>
  )
}

export function ImageIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 17.5 5-5 3.5 3.5L18 11l1.5 1.5" />
    </svg>
  )
}

export function LinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.8 4.7a3.6 3.6 0 0 1 5.1 5.1L16 11.6" />
      <path d="M13 17.5 11.2 19.3a3.6 3.6 0 0 1-5.1-5.1L8 12.4" />
    </svg>
  )
}

export function EyeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.2A10.4 10.4 0 0 1 12 5c5 0 8.8 3.4 10 7-.5 1.5-1.4 2.9-2.5 4.1" />
      <path d="M6.5 6.9C4.6 8.1 3.1 9.9 2 12c1.2 3.6 5 7 10 7 1.3 0 2.6-.2 3.7-.7" />
      <path d="M9.9 10a2.9 2.9 0 0 0 4.1 4.1" />
    </svg>
  )
}

export function BellOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M8.2 6.3A6 6 0 0 1 18 10.5c0 2.6.6 4 1.2 4.9M6 10.5c0 4-1.3 5.4-2 6.3h11" />
      <path d="M10.3 19.5a2 2 0 0 0 3.4 0" />
    </svg>
  )
}

export function UserXIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c.9-3.4 3.2-5.5 6-5.5s5.1 2.1 6 5.5" />
      <path d="m16.5 9 4.5 4.5M21 9l-4.5 4.5" />
    </svg>
  )
}

export function UsersRestrictIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="8.5" cy="8.5" r="3" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M3.5 20c.7-3 3-5 5-5s4.3 2 5 5" />
      <path d="M14.5 15.8c1.6.2 3 1.9 3.5 4.2" />
    </svg>
  )
}

export function FlagIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5" />
      <circle cx="12" cy="15.6" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function LogOutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15.5 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2v-2" />
      <path d="M9 12h11.5M17 8.5l3.5 3.5-3.5 3.5" />
    </svg>
  )
}
