import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import ActivityView from './components/ActivityView'
import ProfileView from './components/ProfileView'
import PostDetail from './components/PostDetail'
import ComposeModal from './components/ComposeModal'
import Toast from './components/Toast'
import { initialItems, initialFollowing, initialNotifications, currentUser } from './data'
import './App.css'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('loop-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let nextItemId = 1000

function App() {
  const [items, setItems] = useState(initialItems)
  const [following, setFollowing] = useState(() => new Set(initialFollowing))
  const [notifications, setNotifications] = useState(initialNotifications)
  const [tab, setTab] = useState('home')
  const [theme, setTheme] = useState(getInitialTheme)
  const [composeOpen, setComposeOpen] = useState(false)
  const [openPostId, setOpenPostId] = useState(null)
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

  // Every post/reply carries a live `replies` count derived from how many
  // items point at it as their parent — never stored, always accurate.
  const itemsWithCounts = useMemo(() => {
    const childCount = new Map()
    for (const item of items) {
      if (item.parentId != null) {
        childCount.set(item.parentId, (childCount.get(item.parentId) || 0) + 1)
      }
    }
    return items.map((item) => ({ ...item, replies: childCount.get(item.id) || 0 }))
  }, [items])

  const topLevelPosts = itemsWithCounts.filter((i) => !i.parentId)

  function toggleLike(id) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)))
  }

  function toggleRepost(id) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, reposted: !p.reposted } : p)))
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

  function submitCompose(text) {
    const newPost = {
      id: nextItemId++,
      parentId: null,
      name: currentUser.name,
      handle: currentUser.handle,
      initials: currentUser.initials,
      color: currentUser.color,
      verified: false,
      time: 'Vừa xong',
      text,
      likes: 0,
      reposts: 0,
      liked: false,
      reposted: false,
      mine: true,
    }
    setItems((prev) => [newPost, ...prev])
    setToast('Đã đăng bài!')
    setTab('home')
    setComposeOpen(false)
  }

  function addReply(parentId, text) {
    const newReply = {
      id: nextItemId++,
      parentId,
      name: currentUser.name,
      handle: currentUser.handle,
      initials: currentUser.initials,
      color: currentUser.color,
      verified: false,
      time: 'Vừa xong',
      text,
      likes: 0,
      reposts: 0,
      liked: false,
      reposted: false,
      mine: true,
    }
    setItems((prev) => [...prev, newReply])
    setToast('Đã gửi phản hồi')
  }

  const hasUnread = notifications.some((n) => !n.read)
  const openPost = openPostId ? itemsWithCounts.find((p) => p.id === openPostId) : null
  const openPostChildren = openPost
    ? itemsWithCounts.filter((i) => i.parentId === openPost.id)
    : []
  const openPostParent = openPost?.parentId
    ? itemsWithCounts.find((i) => i.id === openPost.parentId)
    : null

  const sharedFeedProps = {
    posts: topLevelPosts,
    following,
    onToggleLike: toggleLike,
    onToggleRepost: toggleRepost,
    onToggleFollow: toggleFollow,
    onOpenPost: (post) => setOpenPostId(post.id),
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        mode={openPost ? 'detail' : 'feed'}
        onBack={() => setOpenPostId(openPost?.parentId ?? null)}
      />

      <main className="feed">
        {openPost ? (
          <PostDetail
            post={openPost}
            parent={openPostParent}
            replies={openPostChildren}
            following={following}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onToggleFollow={toggleFollow}
            onOpenPost={(p) => setOpenPostId(p.id)}
            onAddReply={addReply}
          />
        ) : (
          <>
            {tab === 'home' && <HomeView {...sharedFeedProps} onOpenCompose={() => setComposeOpen(true)} />}
            {tab === 'search' && <SearchView {...sharedFeedProps} />}
            {tab === 'activity' && (
              <ActivityView
                notifications={notifications}
                onMarkRead={markNotifRead}
                onMarkAllRead={markAllRead}
              />
            )}
            {tab === 'profile' && (
              <ProfileView {...sharedFeedProps} onOpenCompose={() => setComposeOpen(true)} />
            )}
          </>
        )}
      </main>

      {!openPost && (
        <BottomNav
          active={tab}
          hasUnread={hasUnread}
          onNavigate={setTab}
          onOpenCompose={() => setComposeOpen(true)}
        />
      )}

      {composeOpen && <ComposeModal onClose={() => setComposeOpen(false)} onSubmit={submitCompose} />}

      <Toast message={toast} />
    </div>
  )
}

export default App
