import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="page-title">All Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && products.length === 0 && (
        <p className="empty-state">No products yet. Log in and add the first one!</p>
      )}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  )
}
