# Loop

A React + Vite social feed UI styled after Threads, backed by Firebase
(Firestore + Anonymous Auth + Storage) — posts, replies, likes, reposts,
follows, notifications, and 1:1 realtime chat (with typing indicators and
image sharing) are real and shared live between every visitor, not local UI
state.

**Live**: https://helloworld-viwz.onrender.com

## How identity works

There's no sign-up. Every visitor gets a stable anonymous Firebase Auth uid
on first load, and a deterministic "guest" display identity (name, handle,
color) is derived from that uid — see `guestProfileFromUid` in `src/firebase.js`.
Same browser, same guest identity across reloads; different visitors look
different.

## Firebase setup

1. Firestore Database (Native mode), Authentication → Anonymous sign-in enabled.
2. Storage → Get started (default bucket is fine — it's already referenced
   in `src/firebase.js`'s `storageBucket`).
3. Paste `firestore.rules` into Firestore → Rules in the console and publish
   (re-paste after every update — this file also covers `conversations` and
   `conversations/*/messages` for chat, and `blocks`/`reports` for the post
   "..." menu).
4. Paste `storage.rules` into Storage → Rules and publish (covers chat
   image uploads under `chat-images/**`).
5. Authentication → Settings → Authorized domains: add whatever domain the
   app is actually served from (Anonymous sign-in fails with
   `auth/unauthorized-domain` otherwise). `localhost` is included by default.
6. `node scripts/seed-firestore.mjs` seeds the `posts` collection with demo
   content once, if it's empty — safe to skip or re-run.
7. Firestore → Indexes: the Inbox screen queries `conversations` with
   `array-contains` on `participants` plus `orderBy('updatedAt')`, which
   needs a composite index. Firestore doesn't create this on its own — open
   the Inbox once while signed into the Firebase console with this project
   selected and check the browser console for a "The query requires an
   index" error with a direct link, or add it manually under Firestore →
   Indexes → Composite: collection `conversations`, fields `participants`
   (Arrays) then `updatedAt` (Descending). Until this index exists, the
   Inbox spins forever instead of loading.

## Chat

Tap the message icon (top-left on the main tabs) for your inbox, or "Nhắn
tin" on someone's profile to start a thread with them. A conversation's
Firestore doc id is the two participants' uids sorted and joined
(`conversationId` in `src/chat.js`), so starting a chat is idempotent — no
query needed to find an existing thread. Typing state lives in a `typing`
map field on the conversation doc, written on keystroke and cleared after
~2.5s of inactivity or on send/unmount; the other client treats it as stale
after 5s so a closed tab doesn't leave "typing…" stuck forever. Images
upload to Storage under `chat-images/{convId}/` before the message doc (with
its download URL) is written.

## Post "..." menu

Every post's overflow menu is a real feature, not a mockup, modeled after
Threads': copy a shareable link, save/unsave (feeds the "Đã lưu" list in
Settings), hide a post from your own home feed ("Không quan tâm", stored per
post per viewer), and — on someone else's post — block them (hides their
posts from your home feed, auto-unfollows, stored in `blocks` exactly like
`follows`) or report the post (write-only `reports` collection, no client
read). "Hỏi Meta AI" is left out entirely rather than faked, since there's
no real AI behind it here; "Tắt thông báo" and "Hạn chế" show a "not
available in this demo" toast since they'd need a thread-subscription /
account-restriction system this app doesn't have.

## Deployment

Hosted on [Render](https://render.com) as a Web Service, auto-deploying from the
`claude/react-hello-world-app-aifp75` branch.

- Build Command: `npm install; npm run build`
- Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

## Local development

```bash
npm install
npm run dev
```
