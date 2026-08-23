import { HomeIcon, SearchIcon, ComposeIcon, ActivityIcon } from './Icons'
import Avatar from './Avatar'
import { currentUser } from '../data'

export default function BottomNav({ active, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: HomeIcon },
    { id: 'search', label: 'Tìm kiếm', icon: SearchIcon },
    { id: 'compose', label: 'Đăng bài', icon: ComposeIcon },
    { id: 'activity', label: 'Hoạt động', icon: ActivityIcon },
  ]

  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-btn${active === id ? ' nav-active' : ''}`}
          aria-label={label}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <Icon active={active === id} />
        </button>
      ))}
      <button
        type="button"
        className={`nav-btn${active === 'profile' ? ' nav-active' : ''}`}
        aria-label="Hồ sơ"
        onClick={() => onNavigate('profile')}
      >
        <Avatar initials={currentUser.initials} color={currentUser.color} size={26} />
      </button>
    </nav>
  )
}
