import { useState } from "react"
import CartDrawer from "./components/CartDrawer"
import Header from "./components/Header"
import Icon from "./components/Icon"
import ProductDetailModal from "./components/ProductDetailModal"
import ShopHome from "./components/ShopHome"
import Sidebar from "./components/Sidebar"
import ServicePages, { type ServicePage } from "./features/ServicePages"
import useCart from "./features/cart/useCart"
import { categories, products, useProducts } from "./features/catalog/catalog"
import { Product } from "./services/type"

export default function App() {
  const [page, setPage] = useState<ServicePage>("shop")
  const [category, setCategory] = useState("For you")
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("For you")
  const [saved, setSaved] = useState<number[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [notice, setNotice] = useState("")
  const [seconds] = useState(3 * 3600 + 42 * 60 + 18)
  const [banner, setBanner] = useState(0)

  const cart = useCart()
  const recommended = useProducts(
    products,
    category,
    query,
    showSaved,
    saved,
    tab,
  )

  function toggleSaved(id: number) {
    setSaved((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]))
  }

  function addToCart(p: Product) {
    cart.add(p)
    setNotice(`${p.name.split(" — ")[0]} added to your cart`)
  }

  function navigate(next: ServicePage) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function openShopSection(id: string) {
    setPage("shop")
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    )
  }

  return (
    <div className="app">
      <Header
        page={page}
        query={query}
        savedCount={saved.length}
        cartCount={cart.count}
        showSaved={showSaved}
        onNavigate={navigate}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
        onToggleSaved={() => {
          navigate("shop")
          setShowSaved(!showSaved)
          setCategory("For you")
        }}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearchSection={openShopSection}
        onSetNotice={setNotice}
      />
      <div className="page-shell">
        <Sidebar
          categories={categories}
          category={category}
          showSaved={showSaved}
          onSelectCategory={(name) => {
            navigate("shop")
            setCategory(name)
            setShowSaved(false)
            setQuery("")
          }}
          onOpenSection={openShopSection}
          onSetTab={setTab}
          onSetNotice={setNotice}
        />
        <main className={page !== "shop" ? "services-main" : ""}>
          {page !== "shop" && (
            <ServicePages
              page={page}
              onProduct={setSelected}
              onAdd={addToCart}
              notify={setNotice}
            />
          )}
          <div hidden={page !== "shop"}>
            <ShopHome
              category={category}
              query={query}
              showSaved={showSaved}
              saved={saved}
              tab={tab}
              banner={banner}
              seconds={seconds}
              products={products}
              recommended={recommended}
              categories={categories}
              onSetCategory={setCategory}
              onSetTab={setTab}
              onSetBanner={setBanner}
              onOpenSection={openShopSection}
              onToggleSave={toggleSaved}
              onAddToCart={addToCart}
              onSelectProduct={setSelected}
              onSetNotice={setNotice}
              onResetQuery={() => {
                setQuery("")
                setCategory("For you")
                setTab("For you")
                setShowSaved(false)
              }}
              onNavigateShop={() => navigate("shop")}
            />
          </div>
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Icon name="shield" size={20} />
          {notice}
          <button aria-label="Dismiss" onClick={() => setNotice("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        count={cart.count}
        total={cart.total}
        onChangeQuantity={cart.change}
        onCheckout={() =>
          setNotice(
            "This is a frontend demo. Checkout requires your external order and payment APIs.",
          )
        }
      />
      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
        isSaved={selected ? saved.includes(selected.id) : false}
        onToggleSave={toggleSaved}
        onAddToCart={addToCart}
      />
    </div>
  )
}
