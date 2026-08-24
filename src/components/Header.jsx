import { SunIcon, MoonIcon, BackIcon, MessageCircleIcon } from './Icons'

export default function Header({ theme, onToggleTheme, mode, title, onBack, onOpenInbox }) {
  const isDetail = mode === 'detail'

  return (
    <header className="app-header">
      {isDetail ? (
        <button className="icon-btn" type="button" onClick={onBack} aria-label="Quay lại">
          <BackIcon />
        </button>
      ) : (
        <button className="icon-btn" type="button" onClick={onOpenInbox} aria-label="Tin nhắn">
          <MessageCircleIcon />
        </button>
      )}

      {isDetail ? (
        <span className="modal-title">{title}</span>
      ) : (
        <div className="brand" aria-label="Loop">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3c-5 0-8 3.5-8 8 0 3.6 2.3 6.3 5.4 7.4.5.2 1-.2.9-.7-.2-1-.1-1.8.4-2.5.6-.9 1.7-1.3 2.9-1 1.3.3 2 1.4 1.8 2.7-.2 1.6-1.8 2.5-3.4 2-1-.3-1.6-1.1-1.5-2.1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 3c5 0 8 3.9 8 8.5 0 3.9-2.3 6.6-5.5 6.6-2 0-3.3-1.1-3.1-2.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <button
        className="icon-btn theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}
