import { useEffect, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import PostCard from './components/PostCard'
import Avatar from './components/Avatar'
import { initialPosts, currentUser } from './data'
import './App.css'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('loop-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [posts, setPosts] = useState(initialPosts)
  const [tab, setTab] = useState('home')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('loop-theme', theme)
  }, [theme])

  function toggleLike(id) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)),
    )
  }

  function toggleRepost(id) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reposted: !p.reposted } : p)),
    )
  }

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />

      <main className="feed">
        <div className="composer">
          <Avatar initials={currentUser.initials} color={currentUser.color} />
          <span className="composer-placeholder">Có gì mới?</span>
          <button className="post-btn" type="button" disabled>
            Đăng
          </button>
        </div>

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
          />
        ))}

        <p className="feed-end">Bạn đã xem hết các bài viết mới</p>
      </main>

      <BottomNav active={tab} onNavigate={setTab} />
    </div>
  )
}

export default App
