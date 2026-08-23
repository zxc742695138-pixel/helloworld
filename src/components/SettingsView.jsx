import {
  PersonIcon,
  UserPlusIcon,
  BellIcon,
  BookmarkIcon,
  HeartIcon,
  HistoryIcon,
  LockIcon,
  SlidersIcon,
  ShareUpIcon,
  GearIcon,
  HelpCircleIcon,
  InfoCircleIcon,
  ChevronRightIcon,
} from './Icons'

export default function SettingsView({ onOpenLiked, onOpenActivity, onLogOut, onUnavailable }) {
  const rows = [
    {
      icon: PersonIcon,
      label: 'Trung tâm tài khoản',
      sub: 'Mật khẩu, bảo mật, thông tin cá nhân, trải nghiệm kết nối, tùy chọn quảng cáo',
      badge: 'Meta',
      onClick: onUnavailable,
    },
    { icon: UserPlusIcon, label: 'Theo dõi và mời bạn bè', onClick: onUnavailable },
    { icon: BellIcon, label: 'Thông báo', onClick: onOpenActivity },
    { icon: BookmarkIcon, label: 'Đã lưu', onClick: onUnavailable },
    { icon: HeartIcon, label: 'Đã thích', onClick: onOpenLiked },
    { icon: HistoryIcon, label: 'Lưu trữ', onClick: onUnavailable },
    { icon: LockIcon, label: 'Quyền riêng tư', onClick: onUnavailable },
    { icon: SlidersIcon, label: 'Tùy chọn về nội dung', onClick: onUnavailable },
    { icon: PersonIcon, label: 'Trạng thái tài khoản', onClick: onUnavailable },
    { icon: ShareUpIcon, label: 'Chia sẻ giữa các trang cá nhân', onClick: onUnavailable },
    { icon: GearIcon, label: 'Cài đặt khác', onClick: onUnavailable },
    { icon: HelpCircleIcon, label: 'Trợ giúp', onClick: onUnavailable },
    { icon: InfoCircleIcon, label: 'Giới thiệu', onClick: onUnavailable },
  ]

  return (
    <div className="view">
      {rows.map(({ icon: Icon, label, sub, badge, onClick }) => (
        <button key={label} type="button" className="settings-row" onClick={onClick}>
          <Icon />
          <span className="settings-row-text">
            <span className="settings-row-label">
              {label}
              {badge && (
                <span className="settings-row-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3c-5 0-8 3.5-8 8 0 3.6 2.3 6.3 5.4 7.4.5.2 1-.2.9-.7-.2-1-.1-1.8.4-2.5.6-.9 1.7-1.3 2.9-1 1.3.3 2 1.4 1.8 2.7-.2 1.6-1.8 2.5-3.4 2-1-.3-1.6-1.1-1.5-2.1M12 3c5 0 8 3.9 8 8.5 0 3.9-2.3 6.6-5.5 6.6-2 0-3.3-1.1-3.1-2.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  {badge}
                </span>
              )}
            </span>
            {sub && <span className="settings-row-sub">{sub}</span>}
          </span>
          <ChevronRightIcon className="settings-row-chevron" width={18} height={18} />
        </button>
      ))}

      <div className="settings-divider" />

      <button type="button" className="settings-link" onClick={onUnavailable}>
        Chuyển tài khoản
      </button>
      <button type="button" className="settings-link settings-link-danger" onClick={onLogOut}>
        Đăng xuất
      </button>
    </div>
  )
}
