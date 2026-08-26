import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Firebase web config values are public identifiers, not secrets — real
// access control lives in Firestore security rules, so it's safe to ship
// these in client code.
const firebaseConfig = {
  apiKey: 'AIzaSyD-47AqlcNCwtxvyy0FhRhPKAMkXaGenv8',
  authDomain: 'loop-demo-cbc36.firebaseapp.com',
  projectId: 'loop-demo-cbc36',
  storageBucket: 'loop-demo-cbc36.firebasestorage.app',
  messagingSenderId: '685480202739',
  appId: '1:685480202739:web:188c214cff1ecdf9220286',
}

export const app = initializeApp(firebaseConfig)
// Auto-detect long-polling instead of Firestore's default WebChannel probe —
// keeps things working behind restrictive corporate/proxy networks that
// block the streaming upgrade, at the cost of a slightly slower handshake
// for everyone else.
// Persistent (IndexedDB) local cache: reopening a chat re-renders instantly
// from what's already on disk, and the SDK resumes its listener from where
// it left off, so the server only has to send messages newer than the last
// one already cached — not the whole conversation again.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
export const auth = getAuth(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// Browser default is already LOCAL (localStorage) persistence — signed-in
// state survives reloads and browser restarts with no expiry — but set it
// explicitly so a session never times out by surprise.
setPersistence(auth, browserLocalPersistence).catch((err) => console.error('setPersistence failed', err))

const GUEST_COLORS = ['#f97316', '#0ea5e9', '#ec4899', '#22c55e', '#a855f7', '#eab308', '#14b8a6', '#ef4444']

function hashString(s) {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  }
  return hash
}

// A deterministic color for a given uid, so an avatar without a photo (a
// guest, or a Google account that skipped picking one) still looks
// consistent across reloads instead of getting a random color each time.
export function colorFromUid(uid) {
  return GUEST_COLORS[hashString(uid) % GUEST_COLORS.length]
}

// Anonymous auth gives every visitor a stable uid but no profile — derive a
// consistent-looking guest identity from that uid so different visitors are
// visually distinguishable across reloads without asking anyone to sign up.
export function guestProfileFromUid(uid) {
  const num = hashString(uid) % 10000
  return {
    name: `Khách #${num}`,
    handle: `guest${num}`,
    initials: 'K',
    color: colorFromUid(uid),
    bio: 'Khách ẩn danh trên Loop 👋',
  }
}

const DIACRITICS_RE = /[\u0300-\u036f]/g

// Turns a display name into a URL-safe handle (Vietnamese diacritics
// stripped), with a uid-derived suffix so two people with the same name
// don't collide without needing an availability check.
export function slugifyHandle(name, uid) {
  const base = name
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  return (base || 'user') + uid.slice(-5)
}
