import { useEffect, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import ActivityView from './components/ActivityView'
import ProfileView from './components/ProfileView'
import UserProfileView from './components/UserProfileView'
import SettingsView from './components/SettingsView'
import LikedPostsView from './components/LikedPostsView'
import SavedPostsView from './components/SavedPostsView'
import InboxView from './components/InboxView'
import ChatView from './components/ChatView'
import PostDetail from './components/PostDetail'
import ComposeModal from './components/ComposeModal'
import Toast from './components/Toast'
import { useCloudData } from './useCloudData'
import { startConversation } from './chat'
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
    uid,
    profile,
    posts,
    accounts,
    following,
    blocked,
    notifications,
    toggleLike,
    toggleRepost,
    toggleFollow,
    toggleSave,
    toggleHidden,
    toggleBlock,
    reportPost,
    addPost,
    markNotifRead,
    markAllRead,
    logOut,
  } = useCloudData()

  const [tab, setTab] = useState('home')
  const [theme, setTheme] = useState(getInitialTheme)
  const [composeOpen, setComposeOpen] = useState(false)
  const [screenStack, setScreenStack] = useState([])
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

  const topLevelPosts = posts.filter((i) => !i.parentId && !i.hidden && !blocked.has(i.handle))
  const screen = screenStack[screenStack.length - 1] ?? null

  function pushScreen(next) {
    setScreenStack((prev) => [...prev, next])
  }

  function popScreen() {
    setScreenStack((prev) => prev.slice(0, -1))
  }

  function goToFeed() {
    setScreenStack([])
  }

  function openProfile(handle) {
    if (handle === profile.handle) {
      setTab('profile')
      goToFeed()
    } else {
      pushScreen({ type: 'profile', handle })
    }
  }

  function openSettings() {
    pushScreen({ type: 'settings' })
  }

  function openInbox() {
    pushScreen({ type: 'inbox' })
  }

  async function openChat(other) {
    const me = { uid, name: profile.name, handle: profile.handle, initials: profile.initials, color: profile.color }
    const convId = await startConversation(me, other)
    pushScreen({ type: 'chat', convId, other })
  }

  function openChatDirect(convId, other) {
    pushScreen({ type: 'chat', convId, other })
  }

  function showUnavailable() {
    setToast('Chưa hỗ trợ trong bản demo này')
  }

  function openActivityFromSettings() {
    setTab('activity')
    goToFeed()
  }

  async function handleLogOut() {
    if (!window.confirm('Đăng xuất sẽ tạo một danh tính khách mới. Tiếp tục?')) return
    goToFeed()
    setTab('home')
    await logOut()
    setToast('Đã đăng xuất — bạn đang dùng danh tính khách mới')
  }

  async function handleToggleFollow(handle) {
    const wasFollowing = following.has(handle)
    await toggleFollow(handle)
    setToast(wasFollowing ? `Đã bỏ theo dõi @${handle}` : `Đã theo dõi @${handle}`)
  }

  async function submitCompose(text) {
    await addPost(text)
    setToast('Đã đăng bài!')
    setTab('home')
    goToFeed()
    setComposeOpen(false)
  }

  async function handleAddReply(parentId, text) {
    await addPost(text, parentId)
    setToast('Đã gửi phản hồi')
  }

  async function handleToggleSave(postId) {
    const post = posts.find((p) => p.id === postId)
    const wasSaved = post?.saved
    await toggleSave(postId)
    setToast(wasSaved ? 'Đã bỏ lưu' : 'Đã lưu bài viết')
  }

  async function handleToggleHidden(postId) {
    await toggleHidden(postId)
    setToast('Sẽ ít hiển thị bài viết như thế này hơn')
  }

  async function handleToggleBlock(handle) {
    const isBlocked = blocked.has(handle)
    if (!isBlocked && !window.confirm(`Chặn @${handle}? Bạn sẽ không thấy bài viết của họ trên trang chủ nữa.`)) {
      return
    }
    await toggleBlock(handle)
    setToast(isBlocked ? `Đã bỏ chặn @${handle}` : `Đã chặn @${handle}`)
  }

  async function handleReport(postId) {
    await reportPost(postId)
    setToast('Đã gửi báo cáo, cảm ơn bạn')
  }

  const hasUnread = notifications.some((n) => !n.read)
  const openPost = screen?.type === 'post' ? posts.find((p) => p.id === screen.id) : null
  const openPostChildren = openPost ? posts.filter((i) => i.parentId === openPost.id) : []
  const openPostParent = openPost?.parentId ? posts.find((i) => i.id === openPost.parentId) : null

  const sharedFeedProps = {
    posts: topLevelPosts,
    following,
    blocked,
    onToggleLike: toggleLike,
    onToggleRepost: toggleRepost,
    onToggleFollow: handleToggleFollow,
    onToggleSave: handleToggleSave,
    onToggleHidden: handleToggleHidden,
    onToggleBlock: handleToggleBlock,
    onReport: handleReport,
    onUnavailable: showUnavailable,
    onOpenPost: (post) => pushScreen({ type: 'post', id: post.id }),
    onOpenProfile: openProfile,
    currentUser: profile,
  }

  const headerTitle =
    screen?.type === 'post'
      ? 'Bài viết'
      : screen?.type === 'profile'
        ? `@${screen.handle}`
        : screen?.type === 'settings'
          ? 'Cài đặt'
          : screen?.type === 'liked'
            ? 'Đã thích'
            : screen?.type === 'saved'
              ? 'Đã lưu'
              : screen?.type === 'inbox'
                ? 'Tin nhắn'
                : screen?.type === 'chat'
                  ? screen.other.name
                  : ''

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        mode={screen ? 'detail' : 'feed'}
        title={headerTitle}
        onBack={popScreen}
        onOpenInbox={openInbox}
      />

      <main className="feed">
        {screen?.type === 'post' && openPost && (
          <PostDetail
            post={openPost}
            parent={openPostParent}
            replies={openPostChildren}
            following={following}
            blocked={blocked}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onToggleFollow={handleToggleFollow}
            onToggleSave={handleToggleSave}
            onToggleHidden={handleToggleHidden}
            onToggleBlock={handleToggleBlock}
            onReport={handleReport}
            onUnavailable={showUnavailable}
            onOpenPost={(p) => pushScreen({ type: 'post', id: p.id })}
            onOpenProfile={openProfile}
            onAddReply={handleAddReply}
            currentUser={profile}
          />
        )}

        {screen?.type === 'profile' && (
          <UserProfileView
            handle={screen.handle}
            posts={posts}
            following={following}
            blocked={blocked}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onToggleFollow={handleToggleFollow}
            onToggleSave={handleToggleSave}
            onToggleHidden={handleToggleHidden}
            onToggleBlock={handleToggleBlock}
            onReport={handleReport}
            onUnavailable={showUnavailable}
            onOpenPost={(p) => pushScreen({ type: 'post', id: p.id })}
            onOpenChat={openChat}
          />
        )}

        {screen?.type === 'inbox' && <InboxView uid={uid} onOpenChat={openChatDirect} />}

        {screen?.type === 'chat' && (
          <ChatView
            convId={screen.convId}
            other={screen.other}
            currentUser={{ uid, name: profile.name, handle: profile.handle, initials: profile.initials, color: profile.color }}
          />
        )}

        {screen?.type === 'settings' && (
          <SettingsView
            onOpenLiked={() => pushScreen({ type: 'liked' })}
            onOpenSaved={() => pushScreen({ type: 'saved' })}
            onOpenActivity={openActivityFromSettings}
            onLogOut={handleLogOut}
          />
        )}

        {screen?.type === 'liked' && (
          <LikedPostsView
            posts={posts}
            following={following}
            blocked={blocked}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onToggleFollow={handleToggleFollow}
            onToggleSave={handleToggleSave}
            onToggleHidden={handleToggleHidden}
            onToggleBlock={handleToggleBlock}
            onReport={handleReport}
            onUnavailable={showUnavailable}
            onOpenPost={(p) => pushScreen({ type: 'post', id: p.id })}
            onOpenProfile={openProfile}
          />
        )}

        {screen?.type === 'saved' && (
          <SavedPostsView
            posts={posts}
            following={following}
            blocked={blocked}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onToggleFollow={handleToggleFollow}
            onToggleSave={handleToggleSave}
            onToggleHidden={handleToggleHidden}
            onToggleBlock={handleToggleBlock}
            onReport={handleReport}
            onUnavailable={showUnavailable}
            onOpenPost={(p) => pushScreen({ type: 'post', id: p.id })}
            onOpenProfile={openProfile}
          />
        )}

        {!screen && (
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
              <ProfileView {...sharedFeedProps} onOpenCompose={() => setComposeOpen(true)} onOpenSettings={openSettings} />
            )}
          </>
        )}
      </main>

      {!screen && (
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
