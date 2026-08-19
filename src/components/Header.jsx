export default function Header({ currentView, setCurrentView, cartCount, user, onLogout }) {
  return (
    <header className="header">
      <div className="logo">🛒 ShopSPA</div>
      <nav className="nav-buttons">
        <button
          className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button
          className={`nav-btn ${currentView === 'portal' ? 'active' : ''}`}
          onClick={() => setCurrentView('portal')}
        >
          {user ? 'Add Product' : 'Login / Sign Up'}
        </button>
        <button
          className={`nav-btn ${currentView === 'cart' ? 'active' : ''}`}
          onClick={() => setCurrentView('cart')}
        >
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        {user && (
          <button className="nav-btn" onClick={onLogout}>
            Log Out
          </button>
        )}
      </nav>
    </header>
  )
}
