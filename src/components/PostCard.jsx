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
  onReply,
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

  return (
    <article className="post">
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
              <button className="follow-btn" type="button" onClick={() => onToggleFollow(handle)}>
                Follow
              </button>
            )}
            <button className="icon-btn ghost" type="button" aria-label="Thêm">
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
            onClick={() => onToggleLike(post.id)}
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            className="icon-btn action"
            type="button"
            aria-label="Trả lời"
            onClick={() => onReply(post)}
          >
            <CommentIcon />
          </button>
          <button
            className={`icon-btn action${reposted ? ' reposted' : ''}`}
            type="button"
            aria-pressed={reposted}
            aria-label="Đăng lại"
            onClick={() => onToggleRepost(post.id)}
          >
            <RepostIcon active={reposted} />
          </button>
          <button className="icon-btn action" type="button" aria-label="Chia sẻ">
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
