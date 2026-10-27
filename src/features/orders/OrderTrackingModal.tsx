import Icon from "@/components/Icon";
import { currency } from "../catalog/catalog";
import type { Order } from "./orders";

type Props = {
  order: Order;
  onClose: () => void;
};

const TIMELINE_STEPS = [
  "Order placed",
  "Payment confirmed",
  "Preparing your parcel",
  "On the way",
  "Delivered",
] as const;

export default function OrderTrackingModal({ order, onClose }: Props) {
  const currentStep = {
    "To pay": 0,
    Processing: 2,
    "In transit": 3,
    Delivered: 4,
    Cancelled: -1,
  }[order.status];

  return (
    <div className="overlay product-overlay" onClick={onClose}>
      <section
        className="tracking-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>Your order’s journey</h2>
          <button aria-label="Close details" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="tracking-header">
          <span>{order.id}</span>
          <strong>{order.status}</strong>
          <p>{order.delivery}</p>
        </div>
        <div className="tracking-product">
          <img src={order.product.image} alt={order.product.name} />
          <div>
            <strong>{order.product.name}</strong>
            <p>
              {order.quantity} item(s) · {currency(order.product.price * order.quantity)}
            </p>
          </div>
        </div>
        {order.status === "Cancelled" ? (
          <p className="tracking-message">This demo order was cancelled. No payment was taken.</p>
        ) : (
          <ol className="timeline">
            {TIMELINE_STEPS.map((step, i) => (
              <li className={i <= currentStep ? "complete" : ""} key={step}>
                <span>{i < currentStep ? "✓" : i + 1}</span>
                <div>
                  <strong>{step}</strong>
                  <p>
                    {i === currentStep
                      ? "Current demo status"
                      : i < currentStep
                        ? "Completed · Sample event"
                        : "Waiting for an update"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
        <div className="account-info">
          <Icon name="help" size={18} />
          <p>
            Sample tracking events. Live shipment and payment updates will come from your Order
            service.
          </p>
        </div>
        <button className="primary-button" onClick={onClose}>
          Got it
        </button>
      </section>
    </div>
  );
}
