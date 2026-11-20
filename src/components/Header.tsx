import { type ServicePage } from "../features/ServicePages"
import Icon from "./Icon"

export interface HeaderProps {
  page: ServicePage
  query: string
  savedCount: number
  cartCount: number
  showSaved: boolean
  onNavigate: (next: ServicePage) => void
  onCategoryChange: (cat: string) => void
  onQueryChange: (q: string) => void
  onToggleSaved: () => void
  onOpenCart: () => void
  onOpenSearchSection: (id: string) => void
  onSetNotice: (msg: string) => void
}

export default function Header({
  page,
  query,
  savedCount,
  cartCount,
  showSaved,
  onNavigate,
  onCategoryChange,
  onQueryChange,
  onToggleSaved,
  onOpenCart,
  onOpenSearchSection,
  onSetNotice,
}: HeaderProps) {
  return (
    <>
      <div className="utility-bar">
        <div>
          <span>
            <Icon name="phone" size={13} /> Get the pasar app
          </span>
          <span className="utility-divider" />
          <span>Your everyday finds, a little better.</span>
        </div>
        <div>
          <button
            onClick={() => onSetNotice("Seller onboarding is coming soon.")}
          >
            Become a seller
          </button>
          <button
            onClick={() =>
              onSetNotice("Need help? Contact hello@pasar.example")
            }
          >
            Help center
          </button>
          <button
            onClick={() =>
              onSetNotice(
                "Language is set to English. Prices are in Indonesian rupiah.",
              )
            }
          >
            English <Icon name="down" size={12} />
          </button>
        </div>
      </div>
      <header className="main-header">
        <a
          className="logo"
          href="#"
          onClick={() => {
            onNavigate("shop")
            onCategoryChange("For you")
            onQueryChange("")
          }}
        >
          pasar<span>.</span>
          <span className="logo-mark">
            <Icon name="bag" size={21} />
          </span>
        </a>
        <div className="search-area">
          <div className="search-box">
            <Icon name="search" size={21} />
            <input
              aria-label="Search products"
              value={query}
              onChange={(e) => {
                onNavigate("shop")
                onQueryChange(e.target.value)
              }}
              placeholder="Search for anything you love..."
            />
            <kbd>/</kbd>
            <button
              aria-label="Search"
              onClick={() => onOpenSearchSection("discover")}
            >
              <Icon name="search" size={19} />
            </button>
          </div>
          <div className="trending-searches">
            <span>Trending:</span>
            {[
              "Wireless earbuds",
              "Running shoes",
              "Skincare",
              "Home essentials",
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  onNavigate("shop")
                  onQueryChange(
                    term === "Wireless earbuds"
                      ? "Wireless"
                      : term === "Skincare"
                        ? "Serum"
                        : term === "Home essentials"
                          ? "Ceramic"
                          : "Running",
                  )
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <div className="header-actions">
          <button
            className={showSaved ? "active" : ""}
            aria-label="Saved products"
            onClick={onToggleSaved}
          >
            <Icon name="heart" size={23} />
            {savedCount > 0 && <b>{savedCount}</b>}
          </button>
          <button
            aria-label="Notifications"
            onClick={() =>
              onSetNotice("You're all caught up. New deals arrive every day!")
            }
          >
            <Icon name="bell" size={23} />
            <i />
          </button>
          <button aria-label="Open cart" onClick={onOpenCart}>
            <Icon name="cart" size={24} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <span className="header-divider" />
          <button className="profile" onClick={() => onNavigate("user")}>
            <span>A</span>
            <div>
              Hi, Alex<small>Happy shopping!</small>
            </div>
            <Icon name="down" size={14} />
          </button>
        </div>
      </header>
      <nav className="service-navigation" aria-label="Marketplace sections">
        <div>
          {([
            { id: "shop", label: "Discover", icon: "grid" },
            { id: "products", label: "Products", icon: "bag" },
            { id: "orders", label: "My orders", icon: "truck" },
            { id: "user", label: "My account", icon: "shield" },
          ] as const).map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "active" : ""}
              aria-current={page === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
              {item.id === "orders" && <span>4</span>}
            </button>
          ))}
        </div>
        <span>Your everyday, connected.</span>
      </nav>
    </>
  )
}
