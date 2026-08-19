export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img
        src={product.image_url || 'https://picsum.photos/seed/placeholder/400/300'}
        alt={product.name}
      />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="price">${Number(product.price).toFixed(2)}</span>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          + Add to Cart
        </button>
      </div>
    </div>
  )
}
