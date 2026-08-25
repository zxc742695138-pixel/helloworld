import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
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

const GUEST_COLORS = ['#f97316', '#0ea5e9', '#ec4899', '#22c55e', '#a855f7', '#eab308', '#14b8a6', '#ef4444']

// Anonymous auth gives every visitor a stable uid but no profile — derive a
// consistent-looking guest identity from that uid so different visitors are
// visually distinguishable across reloads without asking anyone to sign up.
export function guestProfileFromUid(uid) {
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) >>> 0
  }
  const num = hash % 10000
  const color = GUEST_COLORS[hash % GUEST_COLORS.length]
  return {
    name: `Khách #${num}`,
    handle: `guest${num}`,
    initials: 'K',
    color,
    bio: 'Khách ẩn danh trên Loop 👋',
  }
}
