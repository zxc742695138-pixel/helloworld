import { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { colorFromUid } from '../firebase'

export default function ProfileSetupView({ uid, googleUserInfo, onSubmit }) {
  const [name, setName] = useState(googleUserInfo?.name || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [objectURL, setObjectURL] = useState(null)
  const [photoURL, setPhotoURL] = useState(googleUserInfo?.photoURL || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Tracks a blob: URL for the locally picked file so it can be revoked on
  // cleanup — an external-resource effect, not state derivable at render.
  useEffect(() => {
    if (!photoFile) return undefined
    const url = URL.createObjectURL(photoFile)
    // eslint-disable-next-line react/set-state-in-effect
    setObjectURL(url)
    return () => {
      setObjectURL(null)
      URL.revokeObjectURL(url)
    }
  }, [photoFile])

  const previewURL = photoFile ? objectURL : photoURL

  function handlePickFile(e) {
    const file = e.target.files?.[0]
    if (file) setPhotoFile(file)
    e.target.value = ''
  }

  function handleRemovePhoto() {
    setPhotoFile(null)
    setPhotoURL(null)
  }

  const trimmedName = name.trim()
  const canSubmit = trimmedName.length > 0 && !saving

  async function handleSubmit() {
    if (!canSubmit) return
    setSaving(true)
    setError('')
    try {
      await onSubmit({ name: trimmedName, photoFile, photoURL: photoFile ? null : photoURL })
    } catch (err) {
      console.error('Complete profile failed', err)
      setError('Không thể lưu thông tin, vui lòng thử lại.')
      setSaving(false)
    }
  }

  const initials = trimmedName ? trimmedName[0].toUpperCase() : '?'
  const fallbackColor = uid ? colorFromUid(uid) : '#999'

  return (
    <div className="app-shell login-shell">
      <div className="login-card profile-setup-card">
        <h1 className="login-title">Hoàn tất hồ sơ</h1>
        <p className="login-subtitle">Đặt tên và ảnh đại diện để mọi người nhận ra bạn.</p>

        <div className="profile-setup-avatar-wrap">
          <Avatar photoURL={previewURL} initials={initials} color={fallbackColor} size={88} />
          <label className="profile-setup-avatar-edit">
            <input type="file" accept="image/*" hidden onChange={handlePickFile} />
            Đổi ảnh
          </label>
        </div>

        {previewURL && (
          <button type="button" className="text-btn" onClick={handleRemovePhoto}>
            Bỏ ảnh
          </button>
        )}

        <input
          className="profile-setup-name-input"
          type="text"
          placeholder="Tên hiển thị"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="login-btn login-btn-google profile-setup-submit"
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {saving ? 'Đang lưu...' : 'Tiếp tục'}
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  )
}
