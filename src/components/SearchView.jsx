import { useMemo, useState } from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { SearchIcon, VerifiedIcon } from './Icons'

function normalize(s) {
  return s.toLowerCase()
}

export default function SearchView({
  posts,
  accounts,
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
  const [query, setQuery] = useState('')
  const q = normalize(query.trim())

  const matchedAccounts = useMemo(() => {
    if (!q) return []
    return accounts.filter(
      (a) => normalize(a.name).includes(q) || normalize(a.handle).includes(q),
    )
  }, [q, accounts])

  const matchedPosts = useMemo(() => {
    if (!q) return []
    return posts.filter(
      (p) =>
        normalize(p.text).includes(q) ||
        normalize(p.name).includes(q) ||
        normalize(p.handle).includes(q),
    )
  }, [q, posts])

  const hasResults = matchedAccounts.length > 0 || matchedPosts.length > 0

  return (
    <div className="view">
      <div className="search-bar-wrap">
        <div className="search-bar">
          <SearchIcon width={18} height={18} />
          <input
            className="search-input"
            type="text"
            placeholder="Tìm tài khoản hoặc bài viết"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {!q && (
        <>
          <p className="section-label">Tài khoản gợi ý</p>
          {accounts.map((a) => (
            <button className="account-row" type="button" key={a.handle} onClick={() => onOpenProfile(a.handle)}>
              <Avatar initials={a.initials} color={a.color} photoURL={a.photoURL} />
              <div className="account-row-info">
                <span className="post-name">
                  {a.name}
                  {a.verified && <VerifiedIcon />}
                </span>
                <span className="post-handle">@{a.handle}</span>
              </div>
              {following.has(a.handle) ? (
                <span
                  className="follow-btn following"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFollow(a.handle)
                  }}
                >
                  Đang theo dõi
                </span>
              ) : (
                <span
                  className="follow-btn"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFollow(a.handle)
                  }}
                >
                  Follow
                </span>
              )}
            </button>
          ))}
        </>
      )}

      {q && !hasResults && (
        <p className="empty-state">Không tìm thấy kết quả cho "{query}"</p>
      )}

      {q && matchedAccounts.length > 0 && (
        <>
          <p className="section-label">Tài khoản</p>
          {matchedAccounts.map((a) => (
            <button className="account-row" type="button" key={a.handle} onClick={() => onOpenProfile(a.handle)}>
              <Avatar initials={a.initials} color={a.color} photoURL={a.photoURL} />
              <div className="account-row-info">
                <span className="post-name">
                  {a.name}
                  {a.verified && <VerifiedIcon />}
                </span>
                <span className="post-handle">@{a.handle}</span>
              </div>
              {following.has(a.handle) ? (
                <span
                  className="follow-btn following"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFollow(a.handle)
                  }}
                >
                  Đang theo dõi
                </span>
              ) : (
                <span
                  className="follow-btn"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFollow(a.handle)
                  }}
                >
                  Follow
                </span>
              )}
            </button>
          ))}
        </>
      )}

      {q && matchedPosts.length > 0 && (
        <>
          <p className="section-label">Bài viết</p>
          {matchedPosts.map((post) => (
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
        </>
      )}
    </div>
  )
}
