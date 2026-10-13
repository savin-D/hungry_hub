import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-card', { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out' })
      gsap.from('.auth-field', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.2 })
    }, formRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page" ref={formRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="auth-card glass">
          <div className="auth-header">
            <Link to="/" className="auth-logo">◈ HungryHub</Link>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join the community of food lovers</p>
          </div>

          {error && <div className="alert alert-error auth-field">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div className="auth-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="loader-spinner loader-sm" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
