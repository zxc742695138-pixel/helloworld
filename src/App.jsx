import { useEffect, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import ActivityView from './components/ActivityView'
import ProfileView from './components/ProfileView'
import ComposeModal from './components/ComposeModal'
import Toast from './components/Toast'
import { initialPosts, initialFollowing, initialNotifications, currentUser } from './data'
import './App.css'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('loop-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let nextPostId = 1000

function App() {
  const [posts, setPosts] = useState(initialPosts)
  const [following, setFollowing] = useState(() => new Set(initialFollowing))
  const [notifications, setNotifications] = useState(initialNotifications)
  const [tab, setTab] = useState('home')
  const [theme, setTheme] = useState(getInitialTheme)
  const [compose, setCompose] = useState(null) // { mode: 'post' | 'reply', target? }
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('loop-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  function toggleLike(id) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)))
  }

  function toggleRepost(id) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, reposted: !p.reposted } : p)))
  }

  function toggleFollow(handle) {
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(handle)) {
        next.delete(handle)
        setToast(`Đã bỏ theo dõi @${handle}`)
      } else {
        next.add(handle)
        setToast(`Đã theo dõi @${handle}`)
      }
      return next
    })
  }

  function markNotifRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setToast('Đã đánh dấu đã đọc tất cả')
  }

  function openComposePost() {
    setCompose({ mode: 'post' })
  }

  function openComposeReply(post) {
    setCompose({ mode: 'reply', target: post })
  }

  function closeCompose() {
    setCompose(null)
  }

  function submitCompose(text) {
    if (compose?.mode === 'reply' && compose.target) {
      const targetId = compose.target.id
      setPosts((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, replies: p.replies + 1 } : p)),
      )
      setToast('Đã gửi phản hồi')
    } else {
      const newPost = {
        id: nextPostId++,
        name: currentUser.name,
        handle: currentUser.handle,
        initials: currentUser.initials,
        color: currentUser.color,
        verified: false,
        time: 'Vừa xong',
        text,
        likes: 0,
        replies: 0,
        reposts: 0,
        liked: false,
        reposted: false,
        mine: true,
      }
      setPosts((prev) => [newPost, ...prev])
      setToast('Đã đăng bài!')
      setTab('home')
    }
    setCompose(null)
  }

  const hasUnread = notifications.some((n) => !n.read)

  const sharedFeedProps = {
    posts,
    following,
    onToggleLike: toggleLike,
    onToggleRepost: toggleRepost,
    onToggleFollow: toggleFollow,
    onReply: openComposeReply,
  }

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />

      <main className="feed">
        {tab === 'home' && <HomeView {...sharedFeedProps} onOpenCompose={openComposePost} />}
        {tab === 'search' && <SearchView {...sharedFeedProps} />}
        {tab === 'activity' && (
          <ActivityView
            notifications={notifications}
            onMarkRead={markNotifRead}
            onMarkAllRead={markAllRead}
          />
        )}
        {tab === 'profile' && <ProfileView {...sharedFeedProps} onOpenCompose={openComposePost} />}
      </main>

      <BottomNav
        active={tab}
        hasUnread={hasUnread}
        onNavigate={setTab}
        onOpenCompose={openComposePost}
      />

      {compose && (
        <ComposeModal
          mode={compose.mode}
          target={compose.target}
          onClose={closeCompose}
          onSubmit={submitCompose}
        />
      )}

      <Toast message={toast} />
    </div>
  )
}

export default App
