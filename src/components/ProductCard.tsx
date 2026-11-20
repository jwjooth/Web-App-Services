import Icon from "./Icon"
import { currency } from "../features/catalog/catalog"
import { Product } from "../services/type"

export interface ProductCardProps {
  product: Product
  flash?: boolean
  isSaved: boolean
  onToggleSave: (id: number) => void
  onAddToCart: (p: Product) => void
  onSelect: (p: Product) => void
}

export default function ProductCard({
  product: p,
  flash = false,
  isSaved,
  onToggleSave,
  onAddToCart,
  onSelect,
}: ProductCardProps) {
  return (
    <article className="product-card" key={p.id}>
      <div className="product-image" onClick={() => onSelect(p)}>
        <img src={p.image} alt={p.name} loading="lazy" />
        {flash && (
          <span className="discount">
            {Math.round((1 - p.price / p.original) * 100)}% OFF
          </span>
        )}
        <button
          className={`save-button ${isSaved ? "saved" : ""}`}
          aria-label={`Save ${p.name}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave(p.id)
          }}
        >
          <Icon name="heart" size={17} />
        </button>
        <button
          className="quick-add"
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(p)
          }}
        >
          <Icon name="plus" size={16} /> Add to cart
        </button>
      </div>
      <div className="product-info">
        <span
          className={`store-label ${
            p.tag === "Best seller" ? "bestseller" : ""
          }`}
        >
          <Icon name={p.tag === "Best seller" ? "bolt" : "shield"} size={11} />
          {p.tag || "Verified seller"}
        </span>
        <button className="product-name" onClick={() => onSelect(p)}>
          {p.name}
        </button>
        <strong className="price">{currency(p.price)}</strong>
        <div className="original-price">
          <del>{currency(p.original)}</del>
          <span>{Math.round((1 - p.price / p.original) * 100)}%</span>
        </div>
        <div className="rating">
          <span className="star">★</span> {p.rating}
          <span className="separator">|</span>
          <span>{p.sold} sold</span>
        </div>
        {flash ? (
          <div className="stock">
            <div>
              <span style={{ width: `${35 + p.id * 7}%` }} />
            </div>
            <span>Selling fast</span>
          </div>
        ) : (
          <div className="product-city">
            <Icon name="pin" size={12} />
            {p.city}
          </div>
        )}
      </div>
    </article>
  )
}
