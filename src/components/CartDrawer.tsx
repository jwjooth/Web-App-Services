import Icon from "./Icon"
import { currency } from "../features/catalog/catalog"
import { Product } from "../services/type"

export interface CartItemType {
  product: Product
  quantity: number
}

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItemType[]
  count: number
  total: number
  onChangeQuantity: (id: number, delta: number) => void
  onCheckout: () => void
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  count,
  total,
  onChangeQuantity,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose}>
      <section className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="modal-heading">
          <h2>
            Your happy little cart <span>({count})</span>
          </h2>
          <button aria-label="Close cart" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            <Icon name="cart" size={44} />
            <h3>Good finds are waiting.</h3>
            <p>Your cart is empty. Let's change that.</p>
            <button onClick={onClose}>Keep exploring</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <strong>{currency(product.price)}</strong>
                    <div className="quantity">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => onChangeQuantity(product.id, -1)}
                      >
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => onChangeQuantity(product.id, 1)}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{currency(total)}</strong>
              </div>
              <p>Shipping and vouchers calculated at checkout.</p>
              <button className="primary-button" onClick={onCheckout}>
                Continue to checkout <Icon name="arrow" size={18} />
              </button>
              <span className="secure-note">
                <Icon name="shield" size={14} />
                Safe finds. Secure shopping.
              </span>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
