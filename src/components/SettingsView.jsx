import { BellIcon, BookmarkIcon, HeartIcon, ChevronRightIcon } from './Icons'

export default function SettingsView({ onOpenLiked, onOpenSaved, onOpenActivity, onLogOut }) {
  const rows = [
    { icon: BellIcon, label: 'Thông báo', onClick: onOpenActivity },
    { icon: BookmarkIcon, label: 'Đã lưu', onClick: onOpenSaved },
    { icon: HeartIcon, label: 'Đã thích', onClick: onOpenLiked },
  ]

  return (
    <div className="view">
      {rows.map(({ icon: Icon, label, onClick }) => (
        <button key={label} type="button" className="settings-row" onClick={onClick}>
          <Icon />
          <span className="settings-row-text">
            <span className="settings-row-label">{label}</span>
          </span>
          <ChevronRightIcon className="settings-row-chevron" width={18} height={18} />
        </button>
      ))}

      <div className="settings-divider" />

      <button type="button" className="settings-link settings-link-danger" onClick={onLogOut}>
        Đăng xuất
      </button>
    </div>
  )
}
