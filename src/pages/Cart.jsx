import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Cart({ cartItems, updateQuantity, clearCart, user, setCurrentView }) {
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    setError('')

    if (!user) {
      setError('Please log in first to place an order.')
      return
    }
    if (cartItems.length === 0) return

    setPlacing(true)

    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const { error: orderError } = await supabase.from('orders').insert([
      {
        user_id: user.id,
        items: orderItems,
        total: total,
      },
    ])

    setPlacing(false)

    if (orderError) {
      setError(orderError.message)
      return
    }

    alert(`Order placed successfully! Total: $${total.toFixed(2)}`)
    clearCart()
    setCurrentView('home')
  }

  return (
    <div>
      <h1 className="page-title">Your Cart</h1>

      {cartItems.length === 0 && <p className="empty-state">Your cart is empty.</p>}

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <span>${item.price.toFixed(2)} each</span>
          </div>
          <div className="qty-controls">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <>
          <div className="cart-total">Total: ${total.toFixed(2)}</div>
          {error && <div className="error-text" style={{ textAlign: 'right' }}>{error}</div>}
          <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  )
}
