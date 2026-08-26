import { useState } from 'react'
import LoopLogo from './LoopLogo'

function messageFor(err) {
  if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
    return null
  }
  if (err?.code === 'auth/operation-not-allowed') {
    return 'Đăng nhập Google chưa được bật cho ứng dụng này.'
  }
  if (err?.code === 'auth/unauthorized-domain') {
    return 'Tên miền này chưa được cấp phép đăng nhập.'
  }
  return 'Đăng nhập thất bại, vui lòng thử lại.'
}

export default function LoginView({ onGoogleSignIn, onGuestSignIn }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setBusy(true)
    setError('')
    try {
      await onGoogleSignIn()
    } catch (err) {
      console.error('Google sign-in failed', err)
      const message = messageFor(err)
      if (message) setError(message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGuest() {
    setBusy(true)
    setError('')
    try {
      await onGuestSignIn()
    } catch (err) {
      console.error('Guest sign-in failed', err)
      setError('Đăng nhập thất bại, vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell login-shell">
      <div className="login-card">
        <div className="login-logo">
          <LoopLogo size={44} />
        </div>
        <h1 className="login-title">Loop</h1>
        <p className="login-subtitle">Nơi mọi cuộc trò chuyện bắt đầu.</p>

        <button className="login-btn login-btn-google" type="button" disabled={busy} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61Z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.98a9 9 0 0 0 0 8.06l2.97-2.33Z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58Z"
            />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>

        <button className="login-btn login-btn-guest" type="button" disabled={busy} onClick={handleGuest}>
          Đăng nhập dạng khách
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  )
}
