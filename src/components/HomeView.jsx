import Avatar from './Avatar'
import PostCard from './PostCard'

export default function HomeView({
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
  onOpenCompose,
  currentUser,
}) {
  return (
    <div className="view">
      <button className="composer" type="button" onClick={onOpenCompose}>
        <Avatar initials={currentUser.initials} color={currentUser.color} photoURL={currentUser.photoURL} />
        <span className="composer-placeholder">Có gì mới?</span>
        <span className="post-btn post-btn-active">Đăng</span>
      </button>

      {posts.map((post) => (
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
      ))}

      <p className="feed-end">Bạn đã xem hết các bài viết mới</p>
    </div>
  )
}
