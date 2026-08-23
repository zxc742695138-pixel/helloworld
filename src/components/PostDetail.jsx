import { useEffect, useState } from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { CloseIcon } from './Icons'

export default function PostDetail({
  post,
  parent,
  replies,
  following,
  onToggleLike,
  onToggleRepost,
  onToggleFollow,
  onOpenPost,
  onOpenProfile,
  onAddReply,
  currentUser,
}) {
  const [text, setText] = useState('')
  const [replyTarget, setReplyTarget] = useState(post)

  // Reset which item the composer targets whenever we navigate to a
  // different thread page.
  useEffect(() => {
    setReplyTarget(post)
    setText('')
  }, [post.id])

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddReply(replyTarget.id, trimmed)
    setText('')
    setReplyTarget(post)
  }

  const replyingToChild = replyTarget.id !== post.id

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
        onCommentClick={() => setReplyTarget(post)}
        onOpenProfile={onOpenProfile}
        featured
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
          onOpenProfile={onOpenProfile}
          onCommentClick={setReplyTarget}
        />
      ))}

      <div className="reply-compose">
        {replyingToChild && (
          <div className="reply-target-chip">
            <span>
              Đang trả lời <span className="post-name">@{replyTarget.handle}</span>
            </span>
            <button
              type="button"
              className="icon-btn"
              aria-label="Hủy, trả lời bài chính"
              onClick={() => setReplyTarget(post)}
            >
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        )}
        <div className="reply-compose-row">
          <Avatar initials={currentUser.initials} color={currentUser.color} size={36} />
          <input
            className="reply-input"
            type="text"
            placeholder={`Trả lời @${replyTarget.handle}...`}
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
    </div>
  )
}
