import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-card', { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out' })
      gsap.from('.auth-field', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' })
    }, formRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
      gsap.to(formRef.current.querySelector('.auth-card'), {
        x: [-8, 8, -6, 6, -4, 4, 0], duration: 0.5, ease: 'power2.out'
      })
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
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {error && <div className="alert alert-error auth-field">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="loader-spinner loader-sm" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
