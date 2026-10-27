import { useState } from "react";
import Icon from "@/components/Icon";
import { categories, currency, products } from "./catalog";
import type { Product } from "@/services/type";

type Props = {
  onProduct: (product: Product) => void;
  onAdd: (product: Product) => void;
};

export default function CatalogProductsPage({ onProduct, onAdd }: Props) {
  const [productSearch, setProductSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("Featured");

  const catalog = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        (category === "All categories" || p.category === category),
    )
    .sort((a, b) =>
      sort === "Price: low to high"
        ? a.price - b.price
        : sort === "Price: high to low"
          ? b.price - a.price
          : a.id - b.id,
    );

  return (
    <div className="service-panel">
      <div className="catalog-toolbar">
        <label className="service-search">
          <Icon name="search" size={17} />
          <input
            aria-label="Search catalog"
            placeholder="Find a product you love..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All categories</option>
          {categories.slice(1).map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Featured</option>
          <option>Price: low to high</option>
          <option>Price: high to low</option>
        </select>
      </div>

      <div className="catalog-result-count">
        {catalog.length} good finds <span>All prices in IDR · Demo availability</span>
      </div>

      <div className="catalog-table-wrap">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th aria-label="Product actions" />
            </tr>
          </thead>
          <tbody>
            {catalog.map((p) => (
              <tr key={p.id}>
                <td>
                  <button className="catalog-product" onClick={() => onProduct(p)}>
                    <img src={p.image} alt={p.name} />
                    <span>
                      <strong>{p.name}</strong>
                      <small>
                        PSR-{String(p.id).padStart(5, "0")} <span>·</span> ★ {p.rating}
                      </small>
                    </span>
                  </button>
                </td>
                <td>{p.category}</td>
                <td>
                  <strong>{currency(p.price)}</strong>
                  <del>{currency(p.original)}</del>
                </td>
                <td>
                  <span className="availability">
                    <span />
                    In stock
                  </span>
                  <small className="stock-demo">Demo status</small>
                </td>
                <td>
                  <button
                    className="catalog-add"
                    aria-label={`Add ${p.name} to cart`}
                    onClick={() => onAdd(p)}
                  >
                    <Icon name="plus" size={16} />
                    <span>Add</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {catalog.length === 0 && (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h3>No matching finds.</h3>
          <p>Try a different keyword or category.</p>
          <button
            onClick={() => {
              setProductSearch("");
              setCategory("All categories");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
