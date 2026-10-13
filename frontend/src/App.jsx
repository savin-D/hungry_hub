import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import AIRecipe from './pages/AIRecipe'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import NutritionUI from './pages/NutritionUI'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/ai-suggest" element={<AIRecipe />} />
        <Route path="/create" element={<ProtectedRoute><CreateRecipe /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/nutrition-ui" element={<NutritionUI />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function NotFound() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '80px', color: 'var(--wheat-dim)', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--wheat)', marginBottom: '12px' }}>Page not found</h1>
        <p style={{ color: 'var(--wheat-muted)', marginBottom: '32px' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
