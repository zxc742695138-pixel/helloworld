import { useState } from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { currentUser } from '../data'

export default function PostDetail({
  post,
  parent,
  replies,
  following,
  onToggleLike,
  onToggleRepost,
  onToggleFollow,
  onOpenPost,
  onAddReply,
}) {
  const [text, setText] = useState('')

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddReply(post.id, trimmed)
    setText('')
  }

  return (
    <div className="view">
      {parent && (
        <button className="parent-preview" type="button" onClick={() => onOpenPost(parent)}>
          <Avatar initials={parent.initials} color={parent.color} size={28} />
          <span className="parent-preview-text">
            Đang trả lời <span className="post-name">{parent.name}</span> · {parent.text}
          </span>
        </button>
      )}

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

      {replies.map((reply) => (
        <PostCard
          key={reply.id}
          post={reply}
          isFollowing={following.has(reply.handle)}
          isOwn={reply.mine}
          onToggleLike={onToggleLike}
          onToggleRepost={onToggleRepost}
          onToggleFollow={onToggleFollow}
          onOpenPost={onOpenPost}
        />
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
