import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import Avatar from './Avatar'
import { db } from '../firebase'

export default function InboxView({ uid, onOpenChat }) {
  const [conversations, setConversations] = useState(null)

  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
    )
    const unsub = onSnapshot(q, (snap) => {
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
    })
    return unsub
  }, [uid])

  if (conversations === null) {
    return <div className="loading-spinner" style={{ margin: '32px auto' }} aria-label="Đang tải" />
  }

  if (conversations.length === 0) {
    return <p className="empty-state">Chưa có cuộc trò chuyện nào. Nhắn tin cho ai đó từ trang cá nhân của họ.</p>
  }

  return (
    <div className="view">
      {conversations.map((c) => (
        <button key={c.id} type="button" className="account-row" onClick={() => onOpenChat(c.id, c.other)}>
          <Avatar initials={c.other.initials} color={c.other.color} />
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
