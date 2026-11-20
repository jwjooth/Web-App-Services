import Icon from "./Icon"
import { currency } from "../features/catalog/catalog"
import { Product } from "../services/type"

export interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  isSaved: boolean
  onToggleSave: (id: number) => void
  onAddToCart: (p: Product) => void
}

export default function ProductDetailModal({
  product: selected,
  onClose,
  isSaved,
  onToggleSave,
  onAddToCart,
}: ProductDetailModalProps) {
  if (!selected) return null

  return (
    <div className="overlay product-overlay" onClick={onClose}>
      <section className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          aria-label="Close product"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <img src={selected.image} alt={selected.name} />
        <div className="detail-copy">
          <span className="store-label">
            <Icon name="shield" size={13} />
            {selected.tag || "Verified seller"}
          </span>
          <h2>{selected.name}</h2>
          <div className="rating">
            <span className="star">★</span>
            {selected.rating}
            <span className="separator">|</span>
            {selected.sold} sold
          </div>
          <strong className="detail-price">{currency(selected.price)}</strong>
          <del>{currency(selected.original)}</del>
          <p>
            A good find for your everyday. Quality you can count on, from a
            seller you can trust.
          </p>
          <div className="detail-perks">
            <span>
              <Icon name="truck" size={18} />
              Free delivery on your first order
            </span>
            <span>
              <Icon name="shield" size={18} />
              Authenticity guaranteed
            </span>
          </div>
          <button
            className="primary-button"
            onClick={() => onAddToCart(selected)}
          >
            <Icon name="cart" size={19} />
            Add to cart
          </button>
          <button
            className="detail-save"
            onClick={() => onToggleSave(selected.id)}
          >
            <Icon name="heart" size={18} />
            {isSaved ? "Saved to your favorites" : "Save for a little later"}
          </button>
        </div>
      </section>
    </div>
  )
}
