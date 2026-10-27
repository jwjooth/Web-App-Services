import ServiceHeader, { ServiceFooterNote } from "./common/ServiceHeader";
import OrdersPage from "./orders/OrdersPage";
import CatalogProductsPage from "./catalog/CatalogProductsPage";
import UserAccountPage from "./user/UserAccountPage";
import type { Product } from "@/services/type";

export type ServicePage = "shop" | "products" | "orders" | "user";

type Props = {
  page: Exclude<ServicePage, "shop">;
  onProduct: (product: Product) => void;
  onAdd: (product: Product) => void;
  notify: (message: string) => void;
};

const PAGE_METADATA: Record<
  Exclude<ServicePage, "shop">,
  {
    eyebrow: string;
    title: string;
    desc: string;
  }
> = {
  orders: {
    eyebrow: "YOUR PASAR / ORDERS",
    title: "Your orders, all together.",
    desc: "From checkout to your doorstep. Follow every little delivery.",
  },
  products: {
    eyebrow: "YOUR PASAR / PRODUCTS",
    title: "Find your next favorite.",
    desc: "Explore the catalog. Compare good finds. Make it yours.",
  },
  user: {
    eyebrow: "YOUR PASAR / ACCOUNT",
    title: "A little space for you.",
    desc: "Your details, delivery addresses, and everyday preferences.",
  },
};

export default function ServicePages({ page, onProduct, onAdd, notify }: Props) {
  const meta = PAGE_METADATA[page];

  return (
    <div className="service-page">
      <ServiceHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.desc} />

      {page === "orders" && <OrdersPage onProduct={onProduct} onAdd={onAdd} notify={notify} />}
      {page === "products" && <CatalogProductsPage onProduct={onProduct} onAdd={onAdd} />}
      {page === "user" && <UserAccountPage notify={notify} />}

      <ServiceFooterNote />
    </div>
  );
}
