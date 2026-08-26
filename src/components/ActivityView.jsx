import Avatar from './Avatar'
import { HeartIcon, CommentIcon, RepostIcon, UserPlusIcon } from './Icons'

const iconByType = {
  like: HeartIcon,
  reply: CommentIcon,
  repost: RepostIcon,
  follow: UserPlusIcon,
}

const colorByType = {
  like: 'var(--like)',
  reply: 'var(--text-secondary)',
  repost: 'var(--repost)',
  follow: 'var(--accent)',
}

export default function ActivityView({ notifications, onMarkRead, onMarkAllRead }) {
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="view">
      <div className="view-toolbar">
        <p className="section-label section-label-flush">Hoạt động</p>
        {hasUnread && (
          <button className="text-btn" type="button" onClick={onMarkAllRead}>
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <p className="empty-state">Chưa có thông báo nào.</p>
      )}

      {notifications.map((n) => {
        const Icon = iconByType[n.type]
        return (
          <button
            key={n.id}
            type="button"
            className={`notif-row${n.read ? '' : ' notif-unread'}`}
            onClick={() => onMarkRead(n.id)}
          >
            <div className="notif-icon" style={{ color: colorByType[n.type] }}>
              <Icon width={18} height={18} filled={n.type === 'like'} active={n.type === 'repost'} />
            </div>
            <Avatar initials={n.initials} color={n.color} photoURL={n.photoURL} size={36} />
            <p className="notif-text">
              <span className="post-name">{n.name}</span> {n.text}
              <span className="post-dot"> · </span>
              <span className="post-time">{n.time}</span>
            </p>
            {!n.read && <span className="notif-dot" aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}
