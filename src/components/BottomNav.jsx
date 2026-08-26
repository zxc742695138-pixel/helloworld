import { HomeIcon, SearchIcon, ComposeIcon, ActivityIcon } from './Icons'
import Avatar from './Avatar'

export default function BottomNav({ active, hasUnread, onNavigate, onOpenCompose, currentUser }) {
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      <button
        type="button"
        className={`nav-btn${active === 'home' ? ' nav-active' : ''}`}
        aria-label="Trang chủ"
        aria-current={active === 'home' ? 'page' : undefined}
        onClick={() => onNavigate('home')}
      >
        <HomeIcon active={active === 'home'} />
      </button>

      <button
        type="button"
        className={`nav-btn${active === 'search' ? ' nav-active' : ''}`}
        aria-label="Tìm kiếm"
        aria-current={active === 'search' ? 'page' : undefined}
        onClick={() => onNavigate('search')}
      >
        <SearchIcon />
      </button>

      <button type="button" className="nav-btn" aria-label="Đăng bài" onClick={onOpenCompose}>
        <ComposeIcon />
      </button>

      <button
        type="button"
        className={`nav-btn${active === 'activity' ? ' nav-active' : ''}`}
        aria-label="Hoạt động"
        aria-current={active === 'activity' ? 'page' : undefined}
        onClick={() => onNavigate('activity')}
      >
        <span className="nav-icon-wrap">
          <ActivityIcon active={active === 'activity'} />
          {hasUnread && <span className="nav-dot" aria-hidden="true" />}
        </span>
      </button>

      <button
        type="button"
        className={`nav-btn${active === 'profile' ? ' nav-active' : ''}`}
        aria-label="Hồ sơ"
        aria-current={active === 'profile' ? 'page' : undefined}
        onClick={() => onNavigate('profile')}
      >
        <Avatar initials={currentUser.initials} color={currentUser.color} photoURL={currentUser.photoURL} size={26} />
      </button>
    </nav>
  )
}
