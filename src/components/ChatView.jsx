import { useEffect, useRef, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import Avatar from './Avatar'
import { SendIcon, ImageIcon, CloseIcon } from './Icons'
import { db } from '../firebase'
import { sendMessage, setTyping, TYPING_STALE_MS } from '../chat'

// A cached conversation renders almost instantly, so don't flash a spinner
// for that — only show one once loading has actually taken a moment.
const SLOW_LOAD_MS = 400

export default function ChatView({ convId, other, currentUser }) {
  const [messages, setMessages] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)
  const [otherTypingAt, setOtherTypingAt] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [text, setText] = useState('')
  const [pendingImage, setPendingImage] = useState(null)
  const [pendingImageURL, setPendingImageURL] = useState(null)
  const [sending, setSending] = useState(false)
  const typingTimeoutRef = useRef(null)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'conversations', convId, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            senderUid: data.senderUid,
            text: data.text,
            imageURL: data.imageURL,
            createdAtDate: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          }
        }),
      )
    })
    return unsub
  }, [convId])

  useEffect(() => {
    if (messages !== null) {
      setShowSpinner(false)
      return undefined
    }
    const t = setTimeout(() => setShowSpinner(true), SLOW_LOAD_MS)
    return () => clearTimeout(t)
  }, [messages])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'conversations', convId), (snap) => {
      const t = snap.data()?.typing?.[other.uid]
      setOtherTypingAt(t?.toDate ? t.toDate().getTime() : null)
    })
    return unsub
  }, [convId, other.uid])

  // Re-check every second so a stale "typing..." (tab closed, no clean stop)
  // disappears on its own instead of sticking forever.
  useEffect(() => {
    if (!otherTypingAt) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [otherTypingAt])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingImage])

  useEffect(() => {
    if (!pendingImage) {
      setPendingImageURL(null)
      return undefined
    }
    const url = URL.createObjectURL(pendingImage)
    setPendingImageURL(url)
    return () => URL.revokeObjectURL(url)
  }, [pendingImage])

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current)
      setTyping(convId, currentUser.uid, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId])

  const isOtherTyping = otherTypingAt && now - otherTypingAt < TYPING_STALE_MS

  function handleTextChange(value) {
    setText(value)
    setTyping(convId, currentUser.uid, true)
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(convId, currentUser.uid, false), 2500)
  }

  function handlePickImage(e) {
    const file = e.target.files?.[0]
    if (file) setPendingImage(file)
    e.target.value = ''
  }

  async function handleSend() {
    const trimmed = text.trim()
    if (!trimmed && !pendingImage) return
    setSending(true)
    clearTimeout(typingTimeoutRef.current)
    try {
      await sendMessage(convId, currentUser, { text: trimmed, imageFile: pendingImage })
      setText('')
      setPendingImage(null)
      await setTyping(convId, currentUser.uid, false)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat-view">
      <div className="chat-messages">
        {messages === null ? (
          showSpinner && <div className="loading-spinner" style={{ margin: '32px auto' }} aria-label="Đang tải" />
        ) : messages.length === 0 ? (
          <p className="empty-state">Chưa có tin nhắn nào. Nói lời chào đầu tiên!</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderUid === currentUser.uid
            return (
              <div key={m.id} className={`chat-row${mine ? ' chat-row-mine' : ''}`}>
                {!mine && <Avatar initials={other.initials} color={other.color} size={28} />}
                <div className={`chat-bubble${mine ? ' chat-bubble-mine' : ''}`}>
                  {m.imageURL && <img className="chat-bubble-image" src={m.imageURL} alt="" />}
                  {m.text && <span>{m.text}</span>}
                </div>
              </div>
            )
          })
        )}

        {isOtherTyping && (
          <div className="chat-row">
            <Avatar initials={other.initials} color={other.color} size={28} />
            <div className="chat-bubble chat-typing">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-composer">
        {pendingImageURL && (
          <div className="chat-pending-image">
            <img src={pendingImageURL} alt="" />
            <button type="button" className="icon-btn" aria-label="Bỏ ảnh" onClick={() => setPendingImage(null)}>
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        )}
        <div className="chat-composer-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePickImage}
          />
          <button
            type="button"
            className="icon-btn"
            aria-label="Gửi ảnh"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon />
          </button>
          <input
            className="reply-input"
            type="text"
            placeholder="Nhắn tin..."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />
          <button
            className="icon-btn theme-toggle"
            type="button"
            aria-label="Gửi"
            disabled={sending || (!text.trim() && !pendingImage)}
            onClick={handleSend}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
