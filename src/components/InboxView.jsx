import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import Avatar from './Avatar'
import { db } from '../firebase'

// A cached inbox renders almost instantly, so don't flash a spinner for
// that — only show one once loading has actually taken a moment.
const SLOW_LOAD_MS = 400

export default function InboxView({ uid, onOpenChat }) {
  const [conversations, setConversations] = useState(null)
  const [error, setError] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    const spinnerTimer = setTimeout(() => setShowSpinner(true), SLOW_LOAD_MS)
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        clearTimeout(spinnerTimer)
        setShowSpinner(false)
        setError(null)
        setConversations(
          snap.docs.map((d) => {
            const data = d.data()
            const otherUid = data.participants.find((p) => p !== uid)
            return {
              id: d.id,
              other: data.participantInfo?.[otherUid] || { name: 'Người dùng', handle: '?', initials: '?', color: '#999' },
              lastMessage: data.lastMessage,
            }
          }),
        )
      },
      (err) => {
        clearTimeout(spinnerTimer)
        setShowSpinner(false)
        console.error('Inbox listener failed', err)
        setError(err)
      },
    )
    return () => {
      clearTimeout(spinnerTimer)
      unsub()
    }
  }, [uid])

  if (error) {
    return <p className="empty-state">Không thể tải danh sách tin nhắn. Vui lòng thử lại sau.</p>
  }

  if (conversations === null) {
    return showSpinner ? <div className="loading-spinner" style={{ margin: '32px auto' }} aria-label="Đang tải" /> : null
  }

  if (conversations.length === 0) {
    return <p className="empty-state">Chưa có cuộc trò chuyện nào. Nhắn tin cho ai đó từ trang cá nhân của họ.</p>
  }

  return (
    <div className="view">
      {conversations.map((c) => (
        <button key={c.id} type="button" className="account-row" onClick={() => onOpenChat(c.id, c.other)}>
          <Avatar initials={c.other.initials} color={c.other.color} photoURL={c.other.photoURL} />
          <div className="account-row-info">
            <span className="post-name">{c.other.name}</span>
            <span className="post-handle">
              {c.lastMessage ? c.lastMessage.text : `@${c.other.handle}`}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
