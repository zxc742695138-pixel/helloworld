import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import { CloseIcon } from './Icons'
import { currentUser } from '../data'

const MAX_LEN = 280

export default function ComposeModal({ onClose, onSubmit }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const trimmed = text.trim()
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LEN

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit(trimmed)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Tạo bài viết mới"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-topbar">
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Đóng">
            <CloseIcon />
          </button>
          <span className="modal-title">Bài mới</span>
          <button
            className="post-btn post-btn-active"
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Đăng
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-compose-row">
            <Avatar initials={currentUser.initials} color={currentUser.color} />
            <textarea
              ref={textareaRef}
              className="modal-textarea"
              placeholder="Có gì mới?"
              value={text}
              maxLength={MAX_LEN + 20}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <span className={`char-count${trimmed.length > MAX_LEN ? ' char-over' : ''}`}>
            {trimmed.length}/{MAX_LEN}
          </span>
        </div>
      </div>
    </div>
  )
}
