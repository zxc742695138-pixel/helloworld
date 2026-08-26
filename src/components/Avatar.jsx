export default function Avatar({ initials, color, photoURL, size = 40 }) {
  if (photoURL) {
    return (
      <img
        className="avatar avatar-photo"
        src={photoURL}
        alt=""
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${color}, ${color}cc)`,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  )
}
