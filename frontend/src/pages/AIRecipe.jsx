import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import api from '../api/axios'
import './AIRecipe.css'

export default function AIRecipe() {
  const pageRef = useRef(null)
  const resultRef = useRef(null)
  const [ingredients, setIngredients] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ai-hero', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' })
      gsap.from('.ai-input-card', { opacity: 0, y: 30, duration: 0.7, delay: 0.2, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.from(resultRef.current, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
    }
  }, [result])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ingredients.trim()) return
    setError('')
    setResult('')
    setLoading(true)

    // Particle burst animation
    gsap.to('.ai-submit-btn', { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 })

    try {
      const ingredientList = ingredients
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)

      const res = await api.post('/ai/suggest', { ingredients: ingredientList })
      setResult(res.data.aiRecipe || res.data.suggestion || res.data.recipe || JSON.stringify(res.data))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI is temporarily unavailable. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Format the AI response into readable sections
  const formatResult = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      if (line.startsWith('##')) return <h3 key={i} className="result-heading">{line.replace(/^#+\s*/, '')}</h3>
      if (line.startsWith('#')) return <h2 key={i} className="result-title-h">{line.replace(/^#+\s*/, '')}</h2>
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="result-bold">{line.replace(/\*\*/g, '')}</strong>
      if (line.match(/^\d+\./)) return <p key={i} className="result-step">{line}</p>
      if (line.startsWith('-') || line.startsWith('•')) return <p key={i} className="result-bullet">{line}</p>
      return <p key={i} className="result-p">{line}</p>
    })
  }

  const exampleIngredients = ['chicken, garlic, lemon, herbs', 'pasta, tomatoes, basil', 'eggs, cheese, spinach', 'salmon, dill, capers']

  return (
    <div className="page ai-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="container">

        <div className="ai-hero">
          <span className="ai-icon-glyph">✦</span>
          <p className="section-eyebrow">Powered by Gemini AI</p>
          <h1 className="ai-page-title">
            What's in your<br />
            <em className="ai-title-em">kitchen?</em>
          </h1>
          <p className="section-subtitle ai-subtitle">
            Tell the AI what ingredients you have — it'll craft a complete recipe, step by step.
          </p>
        </div>

        <div className="ai-input-card glass">
          <form onSubmit={handleSubmit} className="ai-form">
            <div className="ai-form-inner">
              <label className="form-label">Your Ingredients</label>
              <div className="ai-textarea-wrap">
                <textarea
                  className="input-field ai-textarea"
                  rows={4}
                  placeholder="e.g. chicken breast, garlic, lemon, rosemary, olive oil..."
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                />
              </div>
              <div className="ai-examples">
                <span className="examples-label">Try:</span>
                {exampleIngredients.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    className="example-chip"
                    onClick={() => setIngredients(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary ai-submit-btn"
              disabled={loading || !ingredients.trim()}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="loader-spinner loader-sm" />
                  Crafting recipe...
                </span>
              ) : (
                <>
                  <span>✦</span>
                  Generate Recipe
                </>
              )}
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error ai-error">{error}</div>}

        {result && (
          <div className="ai-result glass" ref={resultRef}>
            <div className="result-header">
              <span className="result-badge">✦ AI Generated</span>
              <button
                className="btn-ghost result-copy"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copy
              </button>
            </div>
            <div className="result-content">
              {formatResult(result)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
