export default function Avatar({ initials, color, size = 40 }) {
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
