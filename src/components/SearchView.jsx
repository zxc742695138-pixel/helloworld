import { useMemo, useState } from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import { SearchIcon, VerifiedIcon } from './Icons'
import { accounts } from '../data'

function normalize(s) {
  return s.toLowerCase()
}

export default function SearchView({ posts, following, onToggleLike, onToggleRepost, onToggleFollow, onOpenPost }) {
  const [query, setQuery] = useState('')
  const q = normalize(query.trim())

  const matchedAccounts = useMemo(() => {
    if (!q) return []
    return accounts.filter(
      (a) => normalize(a.name).includes(q) || normalize(a.handle).includes(q),
    )
  }, [q])

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
            <div className="account-row" key={a.handle}>
              <Avatar initials={a.initials} color={a.color} />
              <div className="account-row-info">
                <span className="post-name">
                  {a.name}
                  {a.verified && <VerifiedIcon />}
                </span>
                <span className="post-handle">@{a.handle}</span>
              </div>
              {following.has(a.handle) ? (
                <button className="follow-btn following" type="button" onClick={() => onToggleFollow(a.handle)}>
                  Đang theo dõi
                </button>
              ) : (
                <button className="follow-btn" type="button" onClick={() => onToggleFollow(a.handle)}>
                  Follow
                </button>
              )}
            </div>
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
            <div className="account-row" key={a.handle}>
              <Avatar initials={a.initials} color={a.color} />
              <div className="account-row-info">
                <span className="post-name">
                  {a.name}
                  {a.verified && <VerifiedIcon />}
                </span>
                <span className="post-handle">@{a.handle}</span>
              </div>
              {following.has(a.handle) ? (
                <button className="follow-btn following" type="button" onClick={() => onToggleFollow(a.handle)}>
                  Đang theo dõi
                </button>
              ) : (
                <button className="follow-btn" type="button" onClick={() => onToggleFollow(a.handle)}>
                  Follow
                </button>
              )}
            </div>
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
              onToggleLike={onToggleLike}
              onToggleRepost={onToggleRepost}
              onToggleFollow={onToggleFollow}
              onOpenPost={onOpenPost}
            />
          ))}
        </>
      )}
    </div>
  )
}
