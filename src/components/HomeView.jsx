import Avatar from './Avatar'
import PostCard from './PostCard'

export default function HomeView({ posts, following, onToggleLike, onToggleRepost, onToggleFollow, onOpenPost, onOpenCompose, currentUser }) {
  return (
    <div className="view">
      <button className="composer" type="button" onClick={onOpenCompose}>
        <Avatar initials={currentUser.initials} color={currentUser.color} />
        <span className="composer-placeholder">Có gì mới?</span>
        <span className="post-btn post-btn-active">Đăng</span>
      </button>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isFollowing={following.has(post.handle)}
          isOwn={post.mine}
          onToggleLike={onToggleLike}
          onToggleRepost={onToggleRepost}
          onToggleFollow={onToggleFollow}
          onOpenPost={onOpenPost}
        />
      ))}

      <p className="feed-end">Bạn đã xem hết các bài viết mới</p>
    </div>
  )
}
