import {
  addDoc,
  collection,
  deleteField,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebase'

// Deterministic id for a 1:1 conversation so "start a chat" is idempotent —
// no query needed to find an existing thread between two people.
export function conversationId(uidA, uidB) {
  return [uidA, uidB].sort().join('_')
}

export async function startConversation(me, other) {
  const convId = conversationId(me.uid, other.uid)
  await setDoc(
    doc(db, 'conversations', convId),
    {
      participants: [me.uid, other.uid].sort(),
      participantInfo: {
        [me.uid]: { name: me.name, handle: me.handle, initials: me.initials, color: me.color, photoURL: me.photoURL || null },
        [other.uid]: {
          name: other.name,
          handle: other.handle,
          initials: other.initials,
          color: other.color,
          photoURL: other.photoURL || null,
        },
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
  return convId
}

export async function sendMessage(convId, sender, { text, imageFile }) {
  let imageURL = null
  if (imageFile) {
    const path = `chat-images/${convId}/${sender.uid}_${Date.now()}_${imageFile.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, imageFile)
    imageURL = await getDownloadURL(storageRef)
  }

  await addDoc(collection(db, 'conversations', convId, 'messages'), {
    senderUid: sender.uid,
    text: text || null,
    imageURL,
    createdAt: serverTimestamp(),
  })

  await updateDoc(doc(db, 'conversations', convId), {
    lastMessage: { text: text || (imageURL ? 'Đã gửi một ảnh' : ''), senderUid: sender.uid },
    updatedAt: serverTimestamp(),
    [`typing.${sender.uid}`]: deleteField(),
  })
}

export async function setTyping(convId, uid, isTyping) {
  await updateDoc(doc(db, 'conversations', convId), {
    [`typing.${uid}`]: isTyping ? serverTimestamp() : deleteField(),
  })
}

// A typing timestamp older than this is treated as stale (the tab closed,
// the network dropped, etc.) instead of showing "typing..." forever.
export const TYPING_STALE_MS = 5000
