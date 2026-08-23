import { useEffect, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import ActivityView from './components/ActivityView'
import ProfileView from './components/ProfileView'
import PostDetail from './components/PostDetail'
import ComposeModal from './components/ComposeModal'
import Toast from './components/Toast'
import { useCloudData } from './useCloudData'
import './App.css'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('loop-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const {
    ready,
    profile,
    posts,
    accounts,
    following,
    notifications,
    toggleLike,
    toggleRepost,
    toggleFollow,
    addPost,
    markNotifRead,
    markAllRead,
  } = useCloudData()

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

  if (!ready) {
    return (
      <div className="app-shell app-loading">
        <div className="loading-spinner" aria-label="Đang tải" />
      </div>
    )
  }

  const topLevelPosts = posts.filter((i) => !i.parentId)

  async function handleToggleFollow(handle) {
    const wasFollowing = following.has(handle)
    await toggleFollow(handle)
    setToast(wasFollowing ? `Đã bỏ theo dõi @${handle}` : `Đã theo dõi @${handle}`)
  }

  async function submitCompose(text) {
    await addPost(text)
    setToast('Đã đăng bài!')
    setTab('home')
    setComposeOpen(false)
  }

  async function handleAddReply(parentId, text) {
    await addPost(text, parentId)
    setToast('Đã gửi phản hồi')
  }

  const hasUnread = notifications.some((n) => !n.read)
  const openPost = openPostId ? posts.find((p) => p.id === openPostId) : null
  const openPostChildren = openPost ? posts.filter((i) => i.parentId === openPost.id) : []
  const openPostParent = openPost?.parentId ? posts.find((i) => i.id === openPost.parentId) : null

  const sharedFeedProps = {
    posts: topLevelPosts,
    following,
    onToggleLike: toggleLike,
    onToggleRepost: toggleRepost,
    onToggleFollow: handleToggleFollow,
    onOpenPost: (post) => setOpenPostId(post.id),
    currentUser: profile,
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
            onToggleFollow={handleToggleFollow}
            onOpenPost={(p) => setOpenPostId(p.id)}
            onAddReply={handleAddReply}
            currentUser={profile}
          />
        ) : (
          <>
            {tab === 'home' && <HomeView {...sharedFeedProps} onOpenCompose={() => setComposeOpen(true)} />}
            {tab === 'search' && <SearchView {...sharedFeedProps} accounts={accounts} />}
            {tab === 'activity' && (
              <ActivityView
                notifications={notifications}
                onMarkRead={markNotifRead}
                onMarkAllRead={() => {
                  markAllRead()
                  setToast('Đã đánh dấu đã đọc tất cả')
                }}
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
          currentUser={profile}
        />
      )}

      {composeOpen && (
        <ComposeModal onClose={() => setComposeOpen(false)} onSubmit={submitCompose} currentUser={profile} />
      )}

      <Toast message={toast} />
    </div>
  )
}

export default App
