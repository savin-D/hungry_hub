import { useRef, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const linksRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { opacity: 0, x: -20, duration: 0.8, ease: 'power3.out' })
      gsap.from('.nav-link', {
        opacity: 0, y: -10, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" ref={logoRef}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">HungryHub</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`} ref={linksRef}>
          <Link to="/recipes" className={`nav-link ${isActive('/recipes') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Recipes
          </Link>
          <Link to="/ai-suggest" className={`nav-link ${isActive('/ai-suggest') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            AI Chef
          </Link>
          {user ? (
            <>
              <Link to="/create" className={`nav-link ${isActive('/create') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Create
              </Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button className="nav-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary nav-cta" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
