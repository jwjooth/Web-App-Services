import { products } from "../catalog/catalog";

export type OrderStatus = "To pay" | "Processing" | "In transit" | "Delivered" | "Cancelled";
export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  product: (typeof products)[number];
  quantity: number;
  delivery: string;
};

export const demoOrders: Order[] = [
  { id: "PSR-260518-1042", date: "18 May 2026", status: "In transit", product: products[0], quantity: 1, delivery: "Estimated arrival: 21–22 May" },
  { id: "PSR-260518-1038", date: "18 May 2026", status: "To pay", product: products[2], quantity: 2, delivery: "Awaiting payment confirmation" },
  { id: "PSR-260517-0991", date: "17 May 2026", status: "Processing", product: products[3], quantity: 1, delivery: "Your seller is preparing your parcel" },
  { id: "PSR-260510-0814", date: "10 May 2026", status: "Delivered", product: products[1], quantity: 1, delivery: "Delivered on 13 May 2026" },
];
