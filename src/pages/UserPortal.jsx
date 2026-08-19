import { useState } from 'react'
import { supabase } from '../supabaseClient'
import AddProductForm from '../components/AddProductForm'

export default function UserPortal({ user, onProductAdded }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setInfo('Account created! If email confirmation is enabled, check your inbox. Otherwise you can log in now.')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (signInError) {
        setError(signInError.message)
      }
    }
  }

  // Already logged in -> show the protected "Add Product" form
  if (user) {
    return (
      <div>
        <h1 className="page-title">User Portal</h1>
        <p>Logged in as <strong>{user.email}</strong></p>
        <AddProductForm user={user} onProductAdded={onProductAdded} />
      </div>
    )
  }

  // Not logged in -> show login/signup form
  return (
    <div>
      <h1 className="page-title">User Portal</h1>
      <div className="auth-box">
        <h3>{mode === 'login' ? 'Log In' : 'Sign Up'}</h3>
        {error && <div className="error-text">{error}</div>}
        {info && <div className="success-text">{info}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div
          className="auth-toggle"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError('')
            setInfo('')
          }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </div>
      </div>
    </div>
  )
}
