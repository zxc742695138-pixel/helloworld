import PostCard from './PostCard'

export default function SavedPostsView({
  posts,
  following,
  blocked,
  onToggleLike,
  onToggleRepost,
  onToggleFollow,
  onToggleSave,
  onToggleHidden,
  onToggleBlock,
  onReport,
  onUnavailable,
  onOpenPost,
  onOpenProfile,
}) {
  const saved = posts.filter((p) => p.saved)

  return (
    <div className="view">
      {saved.length === 0 ? (
        <p className="empty-state">Bạn chưa lưu bài viết nào.</p>
      ) : (
        saved.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isFollowing={following.has(post.handle)}
            isOwn={post.mine}
            isBlocked={blocked.has(post.handle)}
            onToggleLike={onToggleLike}
            onToggleRepost={onToggleRepost}
            onToggleFollow={onToggleFollow}
            onToggleSave={onToggleSave}
            onToggleHidden={onToggleHidden}
            onToggleBlock={onToggleBlock}
            onReport={onReport}
            onUnavailable={onUnavailable}
            onOpenPost={onOpenPost}
            onOpenProfile={onOpenProfile}
          />
        ))
      )}
    </div>
  )
}
