import Avatar from './Avatar'
import {
  HeartIcon,
  CommentIcon,
  RepostIcon,
  ShareIcon,
  MoreIcon,
  VerifiedIcon,
} from './Icons'

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`
  return String(n)
}

export default function PostCard({
  post,
  isFollowing,
  isOwn,
  onToggleLike,
  onToggleRepost,
  onToggleFollow,
  onOpenPost,
}) {
  const {
    name,
    handle,
    initials,
    color,
    verified,
    time,
    text,
    likes,
    replies,
    reposts,
    liked,
    reposted,
  } = post

  function stop(fn) {
    return (e) => {
      e.stopPropagation()
      fn()
    }
  }

  return (
    <article
      className={`post${onOpenPost ? ' post-clickable' : ''}`}
      onClick={onOpenPost ? () => onOpenPost(post) : undefined}
    >
      <Avatar initials={initials} color={color} />

      <div className="post-body">
        <header className="post-head">
          <div className="post-who">
            <span className="post-name">{name}</span>
            {verified && <VerifiedIcon />}
            <span className="post-handle">@{handle}</span>
            <span className="post-dot">·</span>
            <span className="post-time">{time}</span>
          </div>
          <div className="post-head-right">
            {!isOwn && !isFollowing && (
              <button className="follow-btn" type="button" onClick={stop(() => onToggleFollow(handle))}>
                Follow
              </button>
            )}
            <button className="icon-btn ghost" type="button" aria-label="Thêm" onClick={stop(() => {})}>
              <MoreIcon />
            </button>
          </div>
        </header>

        <p className="post-text">{text}</p>

        <div className="post-actions">
          <button
            className={`icon-btn action${liked ? ' liked' : ''}`}
            type="button"
            aria-pressed={liked}
            aria-label="Thích"
            onClick={stop(() => onToggleLike(post.id))}
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            className="icon-btn action"
            type="button"
            aria-label="Xem phản hồi"
            onClick={stop(() => onOpenPost(post))}
          >
            <CommentIcon />
          </button>
          <button
            className={`icon-btn action${reposted ? ' reposted' : ''}`}
            type="button"
            aria-pressed={reposted}
            aria-label="Đăng lại"
            onClick={stop(() => onToggleRepost(post.id))}
          >
            <RepostIcon active={reposted} />
          </button>
          <button className="icon-btn action" type="button" aria-label="Chia sẻ" onClick={stop(() => {})}>
            <ShareIcon />
          </button>
        </div>

        <p className="post-meta">
          {formatCount(replies)} phản hồi · {formatCount(likes + (liked ? 1 : 0))} lượt thích
        </p>
      </div>
    </article>
  )
}
