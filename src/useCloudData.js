import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { onAuthStateChanged, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth'
import { auth, colorFromUid, db, googleProvider, guestProfileFromUid, slugifyHandle, storage } from './firebase'

function formatRelativeTime(date) {
  if (!date) return 'Vừa xong'
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 45) return 'Vừa xong'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ`
  const days = Math.floor(hours / 24)
  return `${days} ngày`
}

// Every post/reply carries a live reply count and up to 3 distinct
// repliers' avatars, derived from how many items point at it as their
// parent — same derivation the app used with local state, now applied to
// whatever the Firestore listener currently holds.
function withDerivedFields(rawPosts, uid) {
  const childrenByParent = new Map()
  for (const item of rawPosts) {
    if (item.parentId != null) {
      if (!childrenByParent.has(item.parentId)) childrenByParent.set(item.parentId, [])
      childrenByParent.get(item.parentId).push(item)
    }
  }
  return rawPosts.map((item) => {
    const children = childrenByParent.get(item.id) || []
    const seenHandles = new Set()
    const replierAvatars = []
    for (let i = children.length - 1; i >= 0 && replierAvatars.length < 3; i--) {
      const child = children[i]
      if (seenHandles.has(child.handle)) continue
      seenHandles.add(child.handle)
      replierAvatars.push({ initials: child.initials, color: child.color, photoURL: child.photoURL })
    }
    return {
      ...item,
      replies: children.length,
      replierAvatars,
      likes: item.likedBy.length,
      reposts: item.repostedBy.length,
      liked: uid ? item.likedBy.includes(uid) : false,
      reposted: uid ? item.repostedBy.includes(uid) : false,
      saved: uid ? item.savedBy.includes(uid) : false,
      hidden: uid ? item.hiddenBy.includes(uid) : false,
      mine: uid ? item.authorUid === uid : false,
      time: formatRelativeTime(item.createdAtDate),
    }
  })
}

export function useCloudData() {
  // 'loading' | 'signed-out' | 'needs-profile' | 'ready'
  const [authStatus, setAuthStatus] = useState('loading')
  const [uid, setUid] = useState(null)
  const [googleUserInfo, setGoogleUserInfo] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rawPosts, setRawPosts] = useState(null) // null while the first snapshot hasn't arrived
  const [following, setFollowing] = useState(new Set())
  const [blocked, setBlocked] = useState(new Set())
  const [followerCount, setFollowerCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUid(null)
        setProfile(null)
        setGoogleUserInfo(null)
        setAuthStatus('signed-out')
        return
      }
      setUid(user.uid)
      if (user.isAnonymous) {
        setGoogleUserInfo(null)
        setProfile(guestProfileFromUid(user.uid))
        setAuthStatus('ready')
      } else {
        setGoogleUserInfo({ name: user.displayName || '', photoURL: user.photoURL || null })
      }
    })
    return unsub
  }, [])

  // Google accounts (not anonymous) get a real profile document — look it
  // up once we know who's signed in, and route to profile setup the first
  // time there isn't one yet.
  useEffect(() => {
    if (!uid || !googleUserInfo) return undefined
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data())
        setAuthStatus('ready')
      } else {
        setAuthStatus('needs-profile')
      }
    })
    return unsub
  }, [uid, googleUserInfo])

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setRawPosts(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            parentId: data.parentId || null,
            name: data.name,
            handle: data.handle,
            initials: data.initials,
            color: data.color,
            photoURL: data.photoURL || null,
            verified: !!data.verified,
            authorUid: data.authorUid,
            text: data.text,
            createdAtDate: data.createdAt?.toDate ? data.createdAt.toDate() : null,
            likedBy: data.likedBy || [],
            repostedBy: data.repostedBy || [],
            savedBy: data.savedBy || [],
            hiddenBy: data.hiddenBy || [],
          }
        }),
      )
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!uid) return undefined
    const q = query(collection(db, 'follows'), where('followerUid', '==', uid))
    const unsub = onSnapshot(q, (snap) => {
      setFollowing(new Set(snap.docs.map((d) => d.data().handle)))
    })
    return unsub
  }, [uid])

  useEffect(() => {
    if (!uid) return undefined
    const q = query(collection(db, 'blocks'), where('blockerUid', '==', uid))
    const unsub = onSnapshot(q, (snap) => {
      setBlocked(new Set(snap.docs.map((d) => d.data().handle)))
    })
    return unsub
  }, [uid])

  useEffect(() => {
    if (!profile) return undefined
    const q = query(collection(db, 'follows'), where('handle', '==', profile.handle))
    const unsub = onSnapshot(q, (snap) => setFollowerCount(snap.size))
    return unsub
  }, [profile])

  useEffect(() => {
    if (!uid) return undefined
    const q = query(collection(db, 'notifications'), where('toUid', '==', uid), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            type: data.type,
            name: data.fromName,
            handle: data.fromHandle,
            initials: data.fromInitials,
            color: data.fromColor,
            photoURL: data.fromPhotoURL || null,
            text: data.text,
            time: formatRelativeTime(data.createdAt?.toDate ? data.createdAt.toDate() : null),
            read: !!data.read,
          }
        }),
      )
    })
    return unsub
  }, [uid])

  const posts = useMemo(() => (rawPosts ? withDerivedFields(rawPosts, uid) : null), [rawPosts, uid])

  const accounts = useMemo(() => {
    if (!posts) return []
    const byHandle = new Map()
    for (const p of posts) {
      if (p.handle !== profile?.handle && !byHandle.has(p.handle)) {
        byHandle.set(p.handle, {
          name: p.name,
          handle: p.handle,
          initials: p.initials,
          color: p.color,
          photoURL: p.photoURL,
          verified: p.verified,
        })
      }
    }
    return [...byHandle.values()]
  }, [posts, profile])

  function notify(toUid, payload) {
    if (!toUid || toUid === uid) return Promise.resolve()
    return addDoc(collection(db, 'notifications'), {
      toUid,
      fromUid: uid,
      fromName: profile.name,
      fromHandle: profile.handle,
      fromInitials: profile.initials,
      fromColor: profile.color,
      fromPhotoURL: profile.photoURL || null,
      read: false,
      createdAt: serverTimestamp(),
      ...payload,
    })
  }

  async function toggleLike(postId) {
    if (!uid || !rawPosts) return
    const post = rawPosts.find((p) => p.id === postId)
    if (!post) return
    const alreadyLiked = post.likedBy.includes(uid)
    await updateDoc(doc(db, 'posts', postId), {
      likedBy: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid),
    })
    if (!alreadyLiked) {
      await notify(post.authorUid, { type: 'like', text: 'đã thích bài viết của bạn', postId })
    }
  }

  async function toggleRepost(postId) {
    if (!uid || !rawPosts) return
    const post = rawPosts.find((p) => p.id === postId)
    if (!post) return
    const already = post.repostedBy.includes(uid)
    await updateDoc(doc(db, 'posts', postId), {
      repostedBy: already ? arrayRemove(uid) : arrayUnion(uid),
    })
    if (!already) {
      await notify(post.authorUid, { type: 'repost', text: 'đã đăng lại bài viết của bạn', postId })
    }
  }

  async function toggleSave(postId) {
    if (!uid || !rawPosts) return
    const post = rawPosts.find((p) => p.id === postId)
    if (!post) return
    const already = post.savedBy.includes(uid)
    await updateDoc(doc(db, 'posts', postId), {
      savedBy: already ? arrayRemove(uid) : arrayUnion(uid),
    })
  }

  async function toggleHidden(postId) {
    if (!uid || !rawPosts) return
    const post = rawPosts.find((p) => p.id === postId)
    if (!post) return
    const already = post.hiddenBy.includes(uid)
    await updateDoc(doc(db, 'posts', postId), {
      hiddenBy: already ? arrayRemove(uid) : arrayUnion(uid),
    })
  }

  async function toggleBlock(handle) {
    if (!uid) return
    const ref_ = doc(db, 'blocks', `${uid}_${handle}`)
    if (blocked.has(handle)) {
      await deleteDoc(ref_)
      return
    }
    await setDoc(ref_, { blockerUid: uid, handle, createdAt: serverTimestamp() })
    if (following.has(handle)) {
      await deleteDoc(doc(db, 'follows', `${uid}_${handle}`))
    }
  }

  async function reportPost(postId) {
    if (!uid) return
    await addDoc(collection(db, 'reports'), {
      postId,
      reporterUid: uid,
      createdAt: serverTimestamp(),
    })
  }

  async function toggleFollow(handle) {
    if (!uid) return
    const ref_ = doc(db, 'follows', `${uid}_${handle}`)
    if (following.has(handle)) {
      await deleteDoc(ref_)
      return
    }
    await setDoc(ref_, { followerUid: uid, handle, createdAt: serverTimestamp() })
    const target = rawPosts?.find((p) => p.handle === handle)
    if (target) {
      await notify(target.authorUid, { type: 'follow', text: 'đã bắt đầu theo dõi bạn' })
    }
  }

  async function addPost(text, parentId = null) {
    if (!uid || !profile) return null
    const docRef = await addDoc(collection(db, 'posts'), {
      parentId,
      authorUid: uid,
      name: profile.name,
      handle: profile.handle,
      initials: profile.initials,
      color: profile.color,
      photoURL: profile.photoURL || null,
      verified: false,
      text,
      likedBy: [],
      repostedBy: [],
      savedBy: [],
      hiddenBy: [],
      createdAt: serverTimestamp(),
    })
    if (parentId) {
      const parent = rawPosts?.find((p) => p.id === parentId)
      if (parent) {
        await notify(parent.authorUid, {
          type: 'reply',
          text: `đã trả lời: "${text.length > 60 ? `${text.slice(0, 60)}…` : text}"`,
          postId: parentId,
        })
      }
    }
    return docRef.id
  }

  async function markNotifRead(id) {
    await updateDoc(doc(db, 'notifications', id), { read: true })
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read)
    if (unread.length === 0) return
    const batch = writeBatch(db)
    unread.forEach((n) => batch.update(doc(db, 'notifications', n.id), { read: true }))
    await batch.commit()
  }

  async function signInGuest() {
    await signInAnonymously(auth)
  }

  async function signInGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  // First-time Google sign-in: the caller already prefilled name/photo from
  // the Google account (via googleUserInfo) and let the user edit them —
  // this just persists the real profile document once.
  async function completeProfile({ name, photoFile, photoURL }) {
    if (!uid) return
    const existing = await getDoc(doc(db, 'users', uid))
    if (existing.exists()) return

    let finalPhotoURL = photoURL || null
    if (photoFile) {
      const path = `avatars/${uid}/${Date.now()}_${photoFile.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, photoFile)
      finalPhotoURL = await getDownloadURL(storageRef)
    }

    const trimmedName = name.trim() || 'Người dùng Loop'
    await setDoc(doc(db, 'users', uid), {
      name: trimmedName,
      handle: slugifyHandle(trimmedName, uid),
      initials: trimmedName[0].toUpperCase(),
      color: colorFromUid(uid),
      photoURL: finalPhotoURL,
      bio: '',
      provider: 'google',
      createdAt: serverTimestamp(),
    })
  }

  async function logOut() {
    await signOut(auth)
  }

  return {
    authStatus,
    googleUserInfo,
    ready: authStatus === 'ready' && posts !== null,
    uid,
    profile: profile ? { ...profile, followers: followerCount, following: following.size } : null,
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
    signInGuest,
    signInGoogle,
    completeProfile,
    logOut,
  }
}
