import { useState } from "react";
import type { Product } from "../catalog/catalog";
export default function useCart() {
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>([]);
  function add(product: Product) {
    setItems((current) =>
      current.some((item) => item.product.id === product.id)
        ? current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { product, quantity: 1 }],
    );
  }
  function change(id: number, amount: number) {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }
  return {
    items,
    add,
    change,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}
