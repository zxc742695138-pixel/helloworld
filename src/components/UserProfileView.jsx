import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { VerifiedIcon } from './Icons'
import { db, guestProfileFromUid } from '../firebase'

export default function UserProfileView({
  handle,
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
  onOpenChat,
}) {
  const theirPosts = posts.filter((p) => p.handle === handle && !p.parentId)
  const sample = posts.find((p) => p.handle === handle)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    const q = query(collection(db, 'follows'), where('handle', '==', handle))
    const unsub = onSnapshot(q, (snap) => setFollowerCount(snap.size))
    return unsub
  }, [handle])

  useEffect(() => {
    if (!sample?.authorUid) return undefined
    const q = query(collection(db, 'follows'), where('followerUid', '==', sample.authorUid))
    const unsub = onSnapshot(q, (snap) => setFollowingCount(snap.size))
    return unsub
  }, [sample?.authorUid])

  if (!sample) {
    return <p className="empty-state">Không tìm thấy tài khoản này.</p>
  }

  const bio = sample.authorUid ? guestProfileFromUid(sample.authorUid).bio : ''
  const isFollowing = following.has(handle)

  return (
    <div className="view">
      <div className="profile-header">
        <Avatar initials={sample.initials} color={sample.color} photoURL={sample.photoURL} size={64} />
        <div>
          <p className="post-name profile-name">
            {sample.name}
            {sample.verified && <VerifiedIcon />}
          </p>
          <p className="post-handle">@{handle}</p>
        </div>
      </div>

      <p className="profile-bio">{bio}</p>

      <div className="profile-stats">
        <span>
          <strong>{theirPosts.length}</strong> bài viết
        </span>
        <span>
          <strong>{followerCount}</strong> người theo dõi
        </span>
        <span>
          <strong>{followingCount}</strong> đang theo dõi
        </span>
      </div>

      <div className="profile-action-row">
        <button
          className={`follow-btn profile-follow-btn${isFollowing ? ' following' : ''}`}
          type="button"
          onClick={() => onToggleFollow(handle)}
        >
          {isFollowing ? 'Đang theo dõi' : 'Follow'}
        </button>
        <button
          className="follow-btn profile-follow-btn"
          type="button"
          onClick={() =>
            onOpenChat({
              uid: sample.authorUid,
              name: sample.name,
              handle: sample.handle,
              initials: sample.initials,
              color: sample.color,
              photoURL: sample.photoURL,
            })
          }
        >
          Nhắn tin
        </button>
      </div>

      <p className="section-label">Bài viết</p>

      {theirPosts.length === 0 ? (
        <p className="empty-state">Chưa có bài viết nào.</p>
      ) : (
        theirPosts.map((post) => (
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
          />
        ))
      )}
    </div>
  )
}
