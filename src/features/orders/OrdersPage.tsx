import { useState } from "react";
import Icon from "@/components/Icon";
import { currency } from "../catalog/catalog";
import { demoOrders, type Order, type OrderStatus } from "./orders";
import OrderTrackingModal from "./OrderTrackingModal";
import type { Product } from "@/services/type";

type Props = {
  onProduct: (product: Product) => void;
  onAdd: (product: Product) => void;
  notify: (message: string) => void;
};

const ORDER_STATUSES: OrderStatus[] = [
  "To pay",
  "Processing",
  "In transit",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage({ onProduct, onAdd, notify }: Props) {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [orderFilter, setOrderFilter] = useState("All orders");
  const [search, setSearch] = useState("");
  const [tracking, setTracking] = useState<Order | null>(null);

  const visibleOrders = orders.filter(
    (o) =>
      (orderFilter === "All orders" || o.status === orderFilter) &&
      `${o.id} ${o.product.name}`.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = [
    { label: "All orders", value: orders.length, icon: "bag" },
    {
      label: "On their way",
      value: orders.filter((o) => o.status === "In transit").length,
      icon: "truck",
    },
    {
      label: "To pay",
      value: orders.filter((o) => o.status === "To pay").length,
      icon: "cart",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "Delivered").length,
      icon: "shield",
    },
  ];

  function handleCancelOrder(orderId: string) {
    setOrders((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" as OrderStatus } : o)),
    );
    notify("Order cancelled locally for this demo. No backend request was sent.");
  }

  return (
    <>
      <div className="service-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="stat-icon">
              <Icon name={s.icon} size={23} />
            </span>
            <div>
              <span>{s.label}</span>
              <strong>{s.value.toString().padStart(2, "0")}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="service-panel">
        <div className="service-panel-top">
          <h2>Order history</h2>
          <label className="service-search">
            <Icon name="search" size={17} />
            <input
              aria-label="Search orders"
              placeholder="Search order or product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="order-tabs">
          {["All orders", ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              className={orderFilter === s ? "active" : ""}
              onClick={() => setOrderFilter(s)}
            >
              {s}
              <span>
                {s === "All orders" ? orders.length : orders.filter((o) => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        <div className="order-list">
          {visibleOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-top">
                <span>
                  <Icon name="bag" size={15} />
                  <strong>{order.id}</strong>
                  <span className="order-date">{order.date}</span>
                </span>
                <span
                  className={`status-badge status-${order.status.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-product">
                <button onClick={() => onProduct(order.product)}>
                  <img src={order.product.image} alt={order.product.name} />
                </button>
                <div>
                  <span className="store-label">
                    <Icon name="shield" size={11} />
                    {order.product.tag || "Verified seller"}
                  </span>
                  <button className="order-product-name" onClick={() => onProduct(order.product)}>
                    {order.product.name}
                  </button>
                  <p>
                    Quantity: {order.quantity} <span>·</span> {currency(order.product.price)} each
                  </p>
                </div>
                <div className="order-total">
                  <small>Order total</small>
                  <strong>{currency(order.product.price * order.quantity)}</strong>
                </div>
              </div>

              <div className="order-bottom">
                <span>
                  <Icon name={order.status === "Delivered" ? "shield" : "truck"} size={16} />
                  {order.status === "Cancelled" ? "Cancelled in this demo session" : order.delivery}
                </span>
                <div>
                  {order.status === "To pay" && (
                    <button className="service-outline" onClick={() => handleCancelOrder(order.id)}>
                      Cancel order
                    </button>
                  )}
                  {order.status === "Delivered" ? (
                    <button className="service-solid" onClick={() => onAdd(order.product)}>
                      Buy again <Icon name="plus" size={14} />
                    </button>
                  ) : (
                    <button className="service-solid" onClick={() => setTracking(order)}>
                      {order.status === "In transit" ? "Track order" : "View details"}
                      <Icon name="arrow" size={14} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleOrders.length === 0 && (
          <div className="empty-state">
            <Icon name="bag" size={32} />
            <h3>No orders here yet.</h3>
            <p>Try another status or search term.</p>
            <button
              onClick={() => {
                setSearch("");
                setOrderFilter("All orders");
              }}
            >
              Show all orders
            </button>
          </div>
        )}
      </div>

      {tracking && <OrderTrackingModal order={tracking} onClose={() => setTracking(null)} />}
    </>
  );
}
