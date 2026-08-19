import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import UserPortal from './pages/UserPortal'
import Cart from './pages/Cart'

export default function App() {
  const [currentView, setCurrentView] = useState('home') // 'home' | 'portal' | 'cart'
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [refreshKey, setRefreshKey] = useState(0) // bumped after a product is added, to refetch Home

  // Track login state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, newQty) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((item) => item.id !== productId)
      }
      return prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    })
  }

  const clearCart = () => setCartItems([])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentView('home')
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="app-shell">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {currentView === 'home' && (
          <Home key={refreshKey} onAddToCart={handleAddToCart} />
        )}

        {currentView === 'portal' && (
          <UserPortal
            user={user}
            onProductAdded={() => setRefreshKey((k) => k + 1)}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
            user={user}
            setCurrentView={setCurrentView}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
