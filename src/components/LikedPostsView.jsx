import PostCard from './PostCard'

export default function LikedPostsView({ posts, following, onToggleLike, onToggleRepost, onToggleFollow, onOpenPost, onOpenProfile }) {
  const liked = posts.filter((p) => p.liked)

  return (
    <div className="view">
      {liked.length === 0 ? (
        <p className="empty-state">Bạn chưa thích bài viết nào.</p>
      ) : (
        liked.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isFollowing={following.has(post.handle)}
            isOwn={post.mine}
            onToggleLike={onToggleLike}
            onToggleRepost={onToggleRepost}
            onToggleFollow={onToggleFollow}
            onOpenPost={onOpenPost}
            onOpenProfile={onOpenProfile}
          />
        ))
      )}
    </div>
  )
}
