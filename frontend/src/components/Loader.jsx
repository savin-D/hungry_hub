import './Loader.css'

export default function Loader({ full = false, size = 'md' }) {
  if (full) {
    return (
      <div className="loader-full">
        <div className="loader-spinner" />
      </div>
    )
  }
  return <div className={`loader-spinner loader-${size}`} />
}
