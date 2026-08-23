import { useState } from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { currentUser } from '../data'

export default function PostDetail({ post, following, onToggleLike, onToggleRepost, onToggleFollow, onAddReply }) {
  const [text, setText] = useState('')
  const replies = post.repliesList || []

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddReply(post.id, trimmed)
    setText('')
  }

  return (
    <div className="view">
      <PostCard
        post={post}
        isFollowing={following.has(post.handle)}
        isOwn={post.mine}
        onToggleLike={onToggleLike}
        onToggleRepost={onToggleRepost}
        onToggleFollow={onToggleFollow}
      />

      <p className="section-label">Phản hồi</p>

      {replies.length === 0 && (
        <p className="empty-state">Chưa có phản hồi nào. Hãy là người đầu tiên!</p>
      )}

      {replies.map((r, i) => (
        <div className="reply-row" key={i}>
          <Avatar initials={r.initials} color={r.color} size={36} />
          <div className="reply-row-body">
            <p className="post-who">
              <span className="post-name">{r.name}</span>
              <span className="post-handle">@{r.handle}</span>
              <span className="post-dot">·</span>
              <span className="post-time">{r.time}</span>
            </p>
            <p className="post-text">{r.text}</p>
          </div>
        </div>
      ))}

      <div className="reply-compose">
        <Avatar initials={currentUser.initials} color={currentUser.color} size={36} />
        <input
          className="reply-input"
          type="text"
          placeholder={`Trả lời @${post.handle}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        <button
          className="post-btn post-btn-active"
          type="button"
          disabled={!text.trim()}
          onClick={submit}
        >
          Gửi
        </button>
      </div>
    </div>
  )
}
