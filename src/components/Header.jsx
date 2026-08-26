import { SunIcon, MoonIcon, BackIcon, MessageCircleIcon } from './Icons'
import LoopLogo from './LoopLogo'

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
          <LoopLogo />
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
