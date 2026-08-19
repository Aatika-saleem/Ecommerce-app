import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AddProductForm({ user, onProductAdded }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !price) {
      setError('Name and price are required.')
      return
    }

    setLoading(true)
    const { data, error: insertError } = await supabase
      .from('products')
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          image_url: imageUrl.trim() || null,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess('Product added! Check the Home page.')
    setName('')
    setDescription('')
    setPrice('')
    setImageUrl('')
    onProductAdded(data)
  }

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3>Add a New Product</h3>
      {error && <div className="error-text">{error}</div>}
      {success && <div className="success-text">{success}</div>}
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Price (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}
