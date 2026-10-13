import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './NutritionUI.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Circular SVG progress ── */
function CircleProgress({ value, max = 100, size = 80, stroke = 7, color, label, sub }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / max) * circ
  return (
    <div className="circle-prog-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x={size/2} y={size/2 - 4} textAnchor="middle" dominantBaseline="middle" className="circle-val" fill="white" fontSize="13" fontWeight="700">{value}g</text>
        <text x={size/2} y={size/2 + 10} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.55)" fontSize="9">{sub}</text>
      </svg>
      <span className="circle-label" style={{ color }}>{label}</span>
    </div>
  )
}

/* ── Screen 1: Onboarding ── */
function OnboardingScreen() {
  return (
    <div className="phone-screen onboarding-screen">
      {/* Background blobs */}
      <div className="ob-blob ob-blob-1"/>
      <div className="ob-blob ob-blob-2"/>
      <div className="ob-blob ob-blob-3"/>

      {/* Status bar */}
      <div className="status-bar light">
        <span>9:41</span>
        <div className="status-icons">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0" y="2" width="3" height="8" rx="1" fill="currentColor" opacity="0.4"/>
            <rect x="4.5" y="1.5" width="3" height="8.5" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="9" y="0.5" width="3" height="9.5" rx="1" fill="currentColor"/>
            <rect x="13.5" y="2.5" width="2" height="6" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Hero food visual */}
      <div className="ob-food-stage">
        <div className="ob-plate-glow"/>
        <div className="ob-fork-wrap">
          <div className="food-stack">
            <div className="food-item f-chicken">🍗</div>
            <div className="food-item f-leaf">🥬</div>
            <div className="food-item f-salmon">🐟</div>
            <div className="food-item f-lemon">🍋</div>
          </div>
          <div className="fork-shadow"/>
        </div>
        {/* Floating nutrition tags */}
        <div className="float-tag tag-1 glass-tag">
          <span>🔥</span><strong>220</strong><small>kcal</small>
        </div>
        <div className="float-tag tag-2 glass-tag">
          <span>💪</span><strong>32g</strong><small>protein</small>
        </div>
        <div className="float-tag tag-3 glass-tag">
          <span>🥗</span><strong>Clean</strong>
        </div>
      </div>

      {/* Text content */}
      <div className="ob-content">
        <div className="ob-badge">✦ AI-Powered Nutrition</div>
        <h1 className="ob-headline">
          Let AI guide your<br/>
          <span className="ob-headline-em">healthy choices</span><br/>
          effortlessly
        </h1>
        <p className="ob-sub">Scan, analyze, and personalize your meals with intelligent insights</p>
      </div>

      {/* CTA */}
      <div className="ob-cta-area">
        <div className="ob-dots">
          <span className="dot active"/><span className="dot"/><span className="dot"/>
        </div>
        <button className="ob-cta-btn">
          <span>Analyze My Meal</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <p className="ob-signin">Already have an account? <a>Sign in</a></p>
      </div>

      <div className="phone-home-bar"/>
    </div>
  )
}

/* ── Screen 2: Home ── */
function HomeScreen() {
  const meals = [
    { emoji: '🥗', name: 'Greek Salad Bowl', cal: '180 kcal', tag: 'Vegan', color: '#86EFAC' },
    { emoji: '🍜', name: 'Protein Noodles', cal: '310 kcal', tag: 'Protein', color: '#93C5FD' },
    { emoji: '🥑', name: 'Avocado Toast', cal: '240 kcal', tag: 'Clean', color: '#FDE68A' },
  ]
  const categories = [
    { icon: '🌱', label: 'Vegan', col: '#BBF7D0' },
    { icon: '💪', label: 'Protein', col: '#BFDBFE' },
    { icon: '🥦', label: 'Low Carb', col: '#DDD6FE' },
    { icon: '🍎', label: 'Snacks', col: '#FED7AA' },
    { icon: '🧃', label: 'Drinks', col: '#FDE68A' },
  ]
  return (
    <div className="phone-screen home-screen">
      <div className="hs-bg-blob hs-blob-1"/>
      <div className="hs-bg-blob hs-blob-2"/>

      {/* Status bar */}
      <div className="status-bar light">
        <span>9:41</span>
        <div className="status-icons">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0" y="2" width="3" height="8" rx="1" fill="#6366f1" opacity="0.5"/>
            <rect x="4.5" y="1.5" width="3" height="8.5" rx="1" fill="#6366f1" opacity="0.7"/>
            <rect x="9" y="0.5" width="3" height="9.5" rx="1" fill="#6366f1"/>
            <rect x="13.5" y="2.5" width="2" height="6" rx="0.5" fill="none" stroke="#6366f1" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="hs-header">
        <div className="hs-greeting">
          <div>
            <p className="hs-sub-greeting">Good Morning 🌤</p>
            <h2 className="hs-name">Hi Alex 👋</h2>
          </div>
          <div className="hs-avatar">
            <span>A</span>
            <div className="avatar-ring"/>
          </div>
        </div>

        {/* Search bar */}
        <div className="hs-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="hs-search-placeholder">Search healthy meals...</span>
          <div className="hs-search-filter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Calorie summary card */}
      <div className="hs-cal-card neu-card">
        <div className="cal-card-left">
          <p className="cal-label">Today's Goal</p>
          <div className="cal-nums">
            <span className="cal-current">1,240</span>
            <span className="cal-sep"> / </span>
            <span className="cal-total">2,000 kcal</span>
          </div>
          <div className="cal-bar-wrap">
            <div className="cal-bar-track">
              <div className="cal-bar-fill" style={{ width: '62%' }}/>
            </div>
            <span className="cal-pct">62%</span>
          </div>
        </div>
        <div className="cal-card-right">
          <div className="mini-macro">
            <div className="macro-dot" style={{ background: '#A78BFA' }}/>
            <span>Protein</span><strong>68g</strong>
          </div>
          <div className="mini-macro">
            <div className="macro-dot" style={{ background: '#60A5FA' }}/>
            <span>Carbs</span><strong>142g</strong>
          </div>
          <div className="mini-macro">
            <div className="macro-dot" style={{ background: '#34D399' }}/>
            <span>Fat</span><strong>44g</strong>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="hs-section-header">
        <span className="section-label-dark">Browse by Type</span>
        <span className="see-all">See all</span>
      </div>
      <div className="hs-categories">
        {categories.map((c, i) => (
          <div key={i} className={`cat-pill ${i === 0 ? 'active' : ''}`} style={{ '--cat-col': c.col }}>
            <span className="cat-icon">{c.icon}</span>
            <span className="cat-label">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Smart Meal Picks */}
      <div className="hs-section-header">
        <span className="section-label-dark">Smart Meal Picks ✦</span>
        <span className="see-all">See all</span>
      </div>
      <div className="hs-meals-scroll">
        {meals.map((m, i) => (
          <div key={i} className="meal-card-h glass-card-h">
            <div className="meal-emoji-wrap" style={{ background: `${m.color}33` }}>
              <span className="meal-emoji">{m.emoji}</span>
            </div>
            <div className="meal-info">
              <span className="meal-tag" style={{ color: m.color.replace('33','') }}>{m.tag}</span>
              <p className="meal-name">{m.name}</p>
              <p className="meal-cal">{m.cal}</p>
            </div>
            <button className="meal-add-btn">+</button>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        {[
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>, label: 'Home', active: true },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Saved' },
          { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, label: 'Log', special: true },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>, label: 'Explore' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Profile' },
        ].map((n, i) => (
          <button key={i} className={`nav-btn ${n.active ? 'active' : ''} ${n.special ? 'special' : ''}`}>
            {n.icon}
            {!n.special && <span>{n.label}</span>}
          </button>
        ))}
      </div>
      <div className="phone-home-bar dark"/>
    </div>
  )
}

/* ── Screen 3: Meal Detail ── */
function MealDetailScreen() {
  return (
    <div className="phone-screen detail-screen">
      {/* Header bg image area */}
      <div className="md-hero">
        <div className="md-food-bg">
          <div className="md-food-emoji-big">🍝</div>
          <div className="md-food-glow"/>
          <div className="md-food-particles">
            {['🌿','🧄','🍅','🫒','🌶️'].map((p, i) => (
              <span key={i} className={`particle p-${i}`}>{p}</span>
            ))}
          </div>
        </div>
        {/* Top bar */}
        <div className="md-topbar">
          <button className="md-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="md-topbar-title">Meal Details</span>
          <button className="md-share">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main content card */}
      <div className="md-content">
        {/* Dish name card */}
        <div className="md-name-row">
          <div>
            <div className="md-cuisine-tag">Italian · Vegan</div>
            <h2 className="md-dish-name">Vegan Delight Bowl</h2>
          </div>
          <button className="md-fav">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F472B6" stroke="#F472B6" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Calorie hero */}
        <div className="md-cal-hero">
          <div className="cal-circle-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none"
                stroke="url(#calGrad)" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={314}
                strokeDashoffset={314 * (1 - 0.56)}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A78BFA"/>
                  <stop offset="100%" stopColor="#60A5FA"/>
                </linearGradient>
              </defs>
              <text x="60" y="52" textAnchor="middle" fill="#1E1B2E" fontSize="22" fontWeight="800">280</text>
              <text x="60" y="68" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">Kcal</text>
              <text x="60" y="82" textAnchor="middle" fill="#A78BFA" fontSize="9">of 500 goal</text>
            </svg>
          </div>
          <div className="cal-info">
            <p className="cal-info-title">Daily Intake</p>
            <div className="cal-info-row">
              <div className="cal-dot" style={{ background: '#A78BFA'}}/>
              <span>Consumed</span><strong>280</strong>
            </div>
            <div className="cal-info-row">
              <div className="cal-dot" style={{ background: '#E2E8F0'}}/>
              <span>Remaining</span><strong>220</strong>
            </div>
            <div className="cal-info-row">
              <div className="cal-dot" style={{ background: '#34D399'}}/>
              <span>Burned</span><strong>180</strong>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="md-section-title">Macronutrients</div>
        <div className="md-macros">
          <CircleProgress value={32} max={60} size={78} stroke={6} color="#A78BFA" label="Protein" sub="32g"/>
          <CircleProgress value={28} max={80} size={78} stroke={6} color="#60A5FA" label="Carbs" sub="28g"/>
          <CircleProgress value={12} max={40} size={78} stroke={6} color="#34D399" label="Fat" sub="12g"/>
          <CircleProgress value={8} max={30} size={78} stroke={6} color="#FBBF24" label="Fiber" sub="8g"/>
        </div>

        {/* Ingredients */}
        <div className="md-section-title" style={{ marginTop: 12 }}>Ingredients</div>
        <div className="md-ingredients">
          {['Pasta · 80g', 'Basil · 10g', 'Tomato · 60g', 'Olive Oil · 8ml'].map((item, i) => (
            <div key={i} className="md-ing-chip">{item}</div>
          ))}
        </div>

        {/* Actions */}
        <div className="md-actions">
          <button className="md-btn-outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Update Details
          </button>
          <button className="md-btn-filled">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Food
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Showcase wrapper with iPhone frame ── */
function IPhoneFrame({ screen, label, accentColor }) {
  return (
    <div className="iphone-showcase">
      <p className="screen-label" style={{ color: accentColor }}>{label}</p>
      <div className="iphone-frame">
        <div className="iphone-notch">
          <div className="notch-camera"/><div className="notch-speaker"/>
        </div>
        <div className="iphone-screen">
          {screen}
        </div>
        <div className="iphone-side-btn iphone-vol-1"/>
        <div className="iphone-side-btn iphone-vol-2"/>
        <div className="iphone-side-btn iphone-power"/>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function NutritionUI() {
  const pageRef = useRef(null)
  const [activeScreen, setActiveScreen] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nu-hero-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' })
      gsap.from('.nu-hero-sub', { opacity: 0, y: 30, duration: 0.8, delay: 0.3, ease: 'power3.out' })
      gsap.from('.nu-tags', { opacity: 0, y: 20, duration: 0.6, delay: 0.5 })

      gsap.from('.iphone-showcase', {
        scrollTrigger: { trigger: '.phones-row', start: 'top 80%' },
        opacity: 0, y: 80, scale: 0.92, duration: 1,
        stagger: { each: 0.2, ease: 'power2.out' },
        ease: 'power3.out'
      })

      // Phone float animations
      gsap.to('.iphone-showcase:nth-child(1) .iphone-frame', {
        y: -12, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1
      })
      gsap.to('.iphone-showcase:nth-child(2) .iphone-frame', {
        y: -8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5
      })
      gsap.to('.iphone-showcase:nth-child(3) .iphone-frame', {
        y: -15, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1
      })

      // Food items floating
      gsap.to('.food-item', {
        y: -8, rotation: 5, duration: 2,
        stagger: { each: 0.4, from: 'random' },
        ease: 'sine.inOut', yoyo: true, repeat: -1
      })

      // Floating tags
      gsap.to('.float-tag', {
        y: -6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.8
      })

      // Particles
      gsap.to('.particle', {
        y: '-=10', x: '+=6', rotation: 15, duration: 2.5,
        stagger: { each: 0.3, from: 'random' },
        ease: 'sine.inOut', yoyo: true, repeat: -1
      })

      // Stats counter section
      gsap.from('.nu-stat', {
        scrollTrigger: { trigger: '.nu-stats-row', start: 'top 85%' },
        opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)'
      })

    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="nu-page" ref={pageRef}>
      {/* Page ambient */}
      <div className="nu-blob nu-blob-1"/>
      <div className="nu-blob nu-blob-2"/>
      <div className="nu-blob nu-blob-3"/>

      {/* Hero headline */}
      <div className="nu-hero">
        <div className="nu-hero-eyebrow">
          <span className="nu-eyebrow-tag">✦ UI Design Showcase</span>
          <span className="nu-divider-dot">·</span>
          <span className="nu-eyebrow-tag">Glassmorphism iOS 17</span>
          <span className="nu-divider-dot">·</span>
          <span className="nu-eyebrow-tag">Neumorphic Soft UI</span>
        </div>
        <h1 className="nu-hero-title">
          Healthy Food<br/>
          <span className="nu-title-gradient">Nutrition Assistant</span>
        </h1>
        <p className="nu-hero-sub">
          Three-screen mobile UI kit — Glassmorphism · Pastel Gradients · AI-Powered<br/>
          Dribbble / Behance quality, pixel-perfect alignment
        </p>
        <div className="nu-tags">
          {['Glassmorphism', 'Neumorphism', 'iOS 17 Style', 'Inter Font', 'GSAP Animated', 'Pastel Palette'].map((t, i) => (
            <span key={i} className="nu-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Phones row */}
      <div className="phones-row">
        <IPhoneFrame
          screen={<OnboardingScreen />}
          label="01 · Onboarding"
          accentColor="#A78BFA"
        />
        <IPhoneFrame
          screen={<HomeScreen />}
          label="02 · Home Dashboard"
          accentColor="#60A5FA"
        />
        <IPhoneFrame
          screen={<MealDetailScreen />}
          label="03 · Meal Detail"
          accentColor="#34D399"
        />
      </div>

      {/* Stats row */}
      <div className="nu-stats-row">
        {[
          { num: '3', label: 'Screens Designed', icon: '📱' },
          { num: '48', label: 'UI Components', icon: '⚙️' },
          { num: '12', label: 'Animations', icon: '✨' },
          { num: '100%', label: 'CSS Only', icon: '🎨' },
        ].map((s, i) => (
          <div key={i} className="nu-stat">
            <span className="nu-stat-icon">{s.icon}</span>
            <strong className="nu-stat-num">{s.num}</strong>
            <span className="nu-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Color palette */}
      <div className="nu-palette-section">
        <h3 className="nu-palette-title">Color Palette</h3>
        <div className="nu-palette-row">
          {[
            { col: '#A78BFA', name: 'Soft Lavender' },
            { col: '#60A5FA', name: 'Sky Blue' },
            { col: '#34D399', name: 'Mint Green' },
            { col: '#FBBF24', name: 'Warm Amber' },
            { col: '#F472B6', name: 'Blush Pink' },
            { col: '#E0F2FE', name: 'Ice Blue' },
            { col: '#EDE9FE', name: 'Lavender Mist' },
            { col: '#1E1B2E', name: 'Deep Navy' },
          ].map((p, i) => (
            <div key={i} className="palette-chip">
              <div className="palette-swatch" style={{ background: p.col }}/>
              <span className="palette-hex">{p.col}</span>
              <span className="palette-name">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 80 }}/>
    </div>
  )
}
