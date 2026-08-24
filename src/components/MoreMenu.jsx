import {
  LinkIcon,
  BookmarkIcon,
  EyeOffIcon,
  BellOffIcon,
  UsersRestrictIcon,
  UserXIcon,
  FlagIcon,
} from './Icons'

export default function MoreMenu({
  post,
  isOwn,
  isBlocked,
  onClose,
  onCopyLink,
  onToggleSave,
  onToggleHidden,
  onMuteThread,
  onRestrict,
  onToggleBlock,
  onReport,
}) {
  function run(fn) {
    return () => {
      fn()
      onClose()
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="more-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Tùy chọn bài viết"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="more-sheet-handle" />

        <button type="button" className="more-row" onClick={run(onCopyLink)}>
          <LinkIcon />
          <span>Sao chép liên kết</span>
        </button>

        <button type="button" className="more-row" onClick={run(onToggleSave)}>
          <BookmarkIcon />
          <span>{post.saved ? 'Bỏ lưu' : 'Lưu'}</span>
        </button>

        <button type="button" className="more-row" onClick={run(onToggleHidden)}>
          <EyeOffIcon />
          <span>Không quan tâm</span>
        </button>

        {!isOwn && (
          <>
            <div className="more-divider" />
            <button type="button" className="more-row" onClick={run(onMuteThread)}>
              <BellOffIcon />
              <span>Tắt thông báo</span>
            </button>
            <button type="button" className="more-row" onClick={run(onRestrict)}>
              <UsersRestrictIcon />
              <span>Hạn chế</span>
            </button>
            <button type="button" className="more-row" onClick={run(onToggleBlock)}>
              <UserXIcon />
              <span>{isBlocked ? `Bỏ chặn @${post.handle}` : `Chặn @${post.handle}`}</span>
            </button>
            <button type="button" className="more-row more-row-danger" onClick={run(onReport)}>
              <FlagIcon />
              <span>Báo cáo</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
