import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../api/axios'
import RecipeCard from '../components/RecipeCard'
import Loader from '../components/Loader'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [topRecipes, setTopRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    api.get('/recipes/top').then(res => setTopRecipes(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero-title', { opacity: 0, y: 40, duration: 0.9, skewY: 1 }, '-=0.3')
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
        .from('.hero-actions', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-stats', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, '-=0.3')


      // Scroll section
      gsap.from('.section-header', {
        scrollTrigger: { trigger: '.section-header', start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
      })

      // Feature tiles
      gsap.from('.feature-tile', {
        scrollTrigger: { trigger: '.features-row', start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power3.out'
      })

      // AI section
      gsap.from('.ai-section', {
        scrollTrigger: { trigger: '.ai-section', start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="home-page">
      {/* Ambient glows */}
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="tag">◈ Recipe Discovery Platform</span>
            </div>

            <h1 className="hero-title">
              Discover recipes<br />
              <em className="hero-title-em">crafted with soul</em>
            </h1>

            <p className="hero-subtitle">
              Share, explore, and create extraordinary recipes.<br />
              Let AI inspire your next culinary adventure.
            </p>

            <div className="hero-actions">
              <Link to="/recipes" className="btn-primary hero-btn">
                Browse Recipes
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/ai-suggest" className="btn-ghost hero-btn">
                Ask AI Chef
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-num">100+</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-num">AI</span>
                <span className="stat-label">Powered</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-num">Free</span>
                <span className="stat-label">Always</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orb" />
            <div className="hero-orb hero-orb-2" />
          </div>
        </div>
      </section>

      {/* Top Recipes */}
      <section className="section" ref={sectionRef}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Most Loved</p>
              <h2 className="section-title">Top Recipes</h2>
            </div>
            <Link to="/recipes" className="btn-ghost">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <Loader full />
          ) : topRecipes.length > 0 ? (
            <div className="recipe-grid">
              {topRecipes.map((recipe, i) => (
                <RecipeCard key={recipe._id} recipe={recipe} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <p>No recipes yet — be the first to share!</p>
              <Link to="/create" className="btn-primary">Create Recipe</Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header centered">
            <p className="section-eyebrow">Why HungryHub</p>
            <h2 className="section-title">Everything you need</h2>
          </div>
          <div className="features-row">
            {[
              { icon: '⊕', title: 'Create & Share', desc: 'Post your recipes with photos and step-by-step instructions.' },
              { icon: '⊙', title: 'Search by Ingredient', desc: 'Find recipes using what you already have in your kitchen.' },
              { icon: '◈', title: 'AI Chef', desc: 'Get personalized recipe suggestions powered by Google Gemini.' },
              { icon: '♥', title: 'Like & Discover', desc: 'Curate your favorites and explore trending community recipes.' },
            ].map((f, i) => (
              <div key={i} className="feature-tile glass">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="section">
        <div className="container">
          <div className="ai-section glass">
            <div className="ai-content">
              <span className="tag">Powered by Gemini AI</span>
              <h2 className="section-title ai-title">
                Don't know what to cook?
              </h2>
              <p className="section-subtitle">
                Tell our AI what ingredients you have and it'll craft a complete recipe for you — step by step.
              </p>
              <Link to="/ai-suggest" className="btn-primary">
                Try AI Chef
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="ai-decoration">
              <div className="ai-orb" />
              <span className="ai-glyph">✦</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
