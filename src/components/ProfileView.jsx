import Avatar from './Avatar'
import PostCard from './PostCard'
import { GearIcon } from './Icons'

export default function ProfileView({ posts, following, onToggleLike, onToggleRepost, onToggleFollow, onOpenPost, onOpenCompose, onOpenSettings, currentUser }) {
  const myPosts = posts.filter((p) => p.mine)

  return (
    <div className="view">
      <div className="profile-header">
        <Avatar initials={currentUser.initials} color={currentUser.color} size={64} />
        <div className="profile-header-info">
          <p className="post-name profile-name">{currentUser.name}</p>
          <p className="post-handle">@{currentUser.handle}</p>
        </div>
        <button className="icon-btn" type="button" aria-label="Cài đặt" onClick={onOpenSettings}>
          <GearIcon />
        </button>
      </div>

      <p className="profile-bio">{currentUser.bio}</p>

      <div className="profile-stats">
        <span>
          <strong>{myPosts.length}</strong> bài viết
        </span>
        <span>
          <strong>{currentUser.followers}</strong> người theo dõi
        </span>
        <span>
          <strong>{currentUser.following}</strong> đang theo dõi
        </span>
      </div>

      <p className="section-label">Bài viết của bạn</p>

      {myPosts.length === 0 ? (
        <div className="empty-state profile-empty">
          <p>Bạn chưa đăng bài viết nào.</p>
          <button className="post-btn post-btn-active" type="button" onClick={onOpenCompose}>
            Đăng bài đầu tiên
          </button>
        </div>
      ) : (
        myPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isFollowing={following.has(post.handle)}
            isOwn
            onToggleLike={onToggleLike}
            onToggleRepost={onToggleRepost}
            onToggleFollow={onToggleFollow}
            onOpenPost={onOpenPost}
          />
        ))
      )}
    </div>
  )
}
