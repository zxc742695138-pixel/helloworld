// One-off utility: seed the Firestore `posts` collection with the demo
// content the app used to ship as local mock data, so the feed isn't empty
// on first deploy. Safe to re-run — it skips if `posts` already has data.
//
// Usage: node scripts/seed-firestore.mjs

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, limit } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD-47AqlcNCwtxvyy0FhRhPKAMkXaGenv8',
  authDomain: 'loop-demo-cbc36.firebaseapp.com',
  projectId: 'loop-demo-cbc36',
  storageBucket: 'loop-demo-cbc36.firebasestorage.app',
  messagingSenderId: '685480202739',
  appId: '1:685480202739:web:188c214cff1ecdf9220286',
}

// [localId, parentLocalId, authorUid, name, handle, initials, color, verified, text, fakeLikes, fakeReposts]
const SEED = [
  [1, null, 'seed-maianh', 'Mai Anh', 'maianh.codes', 'MA', '#f97316', true, 'Vừa deploy xong app đầu tay lên Render 🎉 cảm giác thấy code mình chạy thật ngoài đời khác hẳn so với chạy local.', 16, 3],
  [101, 1, 'seed-khang', 'Duy Khang', 'khang.dev', 'DK', '#0ea5e9', false, 'Chúc mừng! Bạn dùng nền tảng nào để build vậy?', 3, 0],
  [102, 101, 'seed-maianh', 'Mai Anh', 'maianh.codes', 'MA', '#f97316', true, 'Mình dùng Render đó bạn, free tier luôn 😄', 4, 0],
  [103, 102, 'seed-khang', 'Duy Khang', 'khang.dev', 'DK', '#0ea5e9', false, 'Ngon, để mình thử luôn tối nay.', 2, 0],
  [104, 1, 'seed-trang', 'Thu Trang', 'trangthu', 'TT', '#ec4899', true, 'Nghe hấp dẫn ghê, mình cũng đang định thử.', 2, 0],
  [2, null, 'seed-khang', 'Duy Khang', 'khang.dev', 'DK', '#0ea5e9', false, 'Static site vs dynamic site: cái nào cũng có chỗ đứng riêng. Đừng vội gắn database vào mọi thứ khi chưa cần.', 28, 5],
  [201, 2, 'seed-long', 'Hoàng Long', 'long.builds', 'HL', '#22c55e', false, 'Đồng ý, static site nhẹ và dễ maintain hơn nhiều.', 5, 0],
  [202, 201, 'seed-khang', 'Duy Khang', 'khang.dev', 'DK', '#0ea5e9', false, 'Chính xác, mình cũng nghĩ vậy.', 2, 0],
  [3, null, 'seed-trang', 'Thu Trang', 'trangthu', 'TT', '#ec4899', true, 'Hôm nay học được: Vite build ra file tĩnh thì host ở đâu cũng được, không nhất thiết cần server Node chạy 24/7.', 9, 1],
  [301, 3, 'seed-ngoc', 'Bảo Ngọc', 'ngoc.ui', 'BN', '#a855f7', false, 'Mình mới biết điều này luôn, cảm ơn bạn!', 3, 0],
  [4, null, 'seed-long', 'Hoàng Long', 'long.builds', 'HL', '#22c55e', false, 'Free tier Render bị sleep sau 15 phút không có ai vào — bình thường thôi, đừng hoảng, load lại là lên.', 6, 0],
  [401, 4, 'seed-maianh', 'Mai Anh', 'maianh.codes', 'MA', '#f97316', true, 'Ha, lần đầu gặp cũng hoảng thật 😅', 3, 0],
  [5, null, 'seed-ngoc', 'Bảo Ngọc', 'ngoc.ui', 'BN', '#a855f7', false, 'Giao diện đẹp không cần nhiều màu, chỉ cần đúng khoảng cách và đúng font.', 14, 2],
  [501, 5, 'seed-khang', 'Duy Khang', 'khang.dev', 'DK', '#0ea5e9', false, 'Chuẩn luôn, spacing với typography quan trọng hơn màu mè.', 4, 0],
]

function fakeUidList(n, salt) {
  return Array.from({ length: n }, (_, i) => `fake-${salt}-${i}`)
}

async function main() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth(app)
  await signInAnonymously(auth)

  const existing = await getDocs(query(collection(db, 'posts'), limit(1)))
  if (!existing.empty) {
    console.log('posts collection already has data — skipping seed.')
    return
  }

  const idMap = new Map()
  for (const [localId, parentLocalId, authorUid, name, handle, initials, color, verified, text, fakeLikes, fakeReposts] of SEED) {
    const docRef = await addDoc(collection(db, 'posts'), {
      parentId: parentLocalId == null ? null : idMap.get(parentLocalId),
      authorUid,
      name,
      handle,
      initials,
      color,
      verified,
      text,
      likedBy: fakeUidList(fakeLikes, `like-${localId}`),
      repostedBy: fakeUidList(fakeReposts, `repost-${localId}`),
      createdAt: serverTimestamp(),
    })
    idMap.set(localId, docRef.id)
    console.log(`seeded ${localId} -> ${docRef.id}`)
  }

  console.log(`Done. Seeded ${SEED.length} posts.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
