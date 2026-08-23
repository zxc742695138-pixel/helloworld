# Loop

A React + Vite social feed UI styled after Threads, backed by Firebase
(Firestore + Anonymous Auth) — posts, replies, likes, reposts, follows, and
notifications are real and shared live between every visitor, not local UI
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
2. Paste `firestore.rules` into Firestore → Rules in the console and publish.
3. Authentication → Settings → Authorized domains: add whatever domain the
   app is actually served from (Anonymous sign-in fails with
   `auth/unauthorized-domain` otherwise). `localhost` is included by default.
4. `node scripts/seed-firestore.mjs` seeds the `posts` collection with demo
   content once, if it's empty — safe to skip or re-run.

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
