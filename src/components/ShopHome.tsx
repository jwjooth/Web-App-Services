import Icon from "./Icon"
import ProductCard from "./ProductCard"
import { Product } from "../services/type"

export interface ShopHomeProps {
  category: string
  query: string
  showSaved: boolean
  saved: number[]
  tab: string
  banner: number
  seconds: number
  products: Product[]
  recommended: Product[]
  categories: Array<{
    name: string
    icon: string
  }>
  onSetCategory: (cat: string) => void
  onSetTab: (tab: string) => void
  onSetBanner: (b: number) => void
  onOpenSection: (id: string) => void
  onToggleSave: (id: number) => void
  onAddToCart: (p: Product) => void
  onSelectProduct: (p: Product) => void
  onSetNotice: (msg: string) => void
  onResetQuery: () => void
  onNavigateShop: () => void
}

export default function ShopHome({
  category,
  query,
  showSaved,
  saved,
  tab,
  banner,
  seconds,
  products,
  recommended,
  categories,
  onSetCategory,
  onSetTab,
  onSetBanner,
  onOpenSection,
  onToggleSave,
  onAddToCart,
  onSelectProduct,
  onSetNotice,
  onResetQuery,
  onNavigateShop,
}: ShopHomeProps) {
  return (
    <div>
      <div className="breadcrumb">
        Home <Icon name="chevron" size={12} />
        <span>
          {showSaved
            ? "Your saved finds"
            : category === "For you"
              ? "Discover"
              : category}
        </span>
        <span className="welcome">A little something for everyone.</span>
      </div>
      <section className="promotions">
        <div className={`hero hero-${banner}`}>
          <div className="hero-copy">
            <span className="eyebrow">
              <span /> THE EVERYDAY UPGRADE
            </span>
            <h1>
              {banner === 0 ? (
                <>
                  Little upgrades.
                  <br />
                  Big happy energy.
                </>
              ) : banner === 1 ? (
                <>
                  Good sound.
                  <br />
                  Great everyday.
                </>
              ) : (
                <>
                  Find your thing.
                  <br />
                  Love every day.
                </>
              )}
            </h1>
            <p>
              Your favorite brands. Fresh finds. Better prices.
              <br />
              Make room for your next favorite thing.
            </p>
            <button
              onClick={() => {
                onSetCategory("Electronics")
                onOpenSection("discover")
              }}
            >
              Explore the collection <Icon name="arrow" size={17} />
            </button>
            <div className="hero-dots">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  aria-label={`Promotion ${i + 1}`}
                  className={banner === i ? "current" : ""}
                  onClick={() => onSetBanner(i)}
                />
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-circle" />
            <span className="hero-spark spark-one">✳</span>
            <span className="hero-spark spark-two">✳</span>
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=90"
              alt="Premium over-ear headphones"
            />
            <div className="floating-label">
              <span>GOOD FINDS, GREAT PRICES</span>
              <strong>
                Up to <b>50% off</b>
              </strong>
            </div>
            <span className="hero-footnote">
              A sound decision, if you ask us.
            </span>
          </div>
        </div>
        <div className="side-promos">
          <div className="shipping-promo">
            <div className="promo-top">
              LESS SHIPPING. MORE SHOPPING.
              <Icon name="truck" size={30} />
            </div>
            <h2>
              Good things.
              <br />
              Free delivery.
            </h2>
            <p>On your first 3 orders. Just because.</p>
            <button
              onClick={() =>
                onSetNotice(
                  "Free delivery voucher claimed! Applies to your first 3 orders once checkout is connected.",
                )
              }
            >
              Claim your perk <Icon name="arrow" size={16} />
            </button>
            <div className="delivery-seal">
              FREE
              <br />
              <b>DELIVERY</b>
            </div>
          </div>
          <div className="new-promo">
            <div>
              <span>NEW HERE? NICE TO MEET YOU.</span>
              <h3>A little welcome gift.</h3>
              <p>Enjoy 10% off your first order.</p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("HELLOPASAR")
                  onSetNotice(
                    "Welcome code HELLOPASAR copied. Demo offer only.",
                  )
                }}
              >
                Get my voucher <Icon name="arrow" size={14} />
              </button>
            </div>
            <Icon name="gift" size={56} />
          </div>
        </div>
      </section>
      <section className="trust-strip">
        {[
          {
            icon: "shield",
            title: "100% authentic",
            text: "Real brands. Real peace of mind.",
          },
          {
            icon: "truck",
            title: "Free delivery",
            text: "More joy, less shipping fees.",
          },
          {
            icon: "bag",
            title: "Shop with confidence",
            text: "Secure payments, always.",
          },
          {
            icon: "headphones",
            title: "Here for you",
            text: "A little help, whenever you need.",
          },
        ].map((item) => (
          <div key={item.title}>
            <span>
              <Icon name={item.icon} size={24} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="category-section">
        <div className="section-heading">
          <div>
            <h2>What are you looking for?</h2>
            <p>A world of good finds, one category away.</p>
          </div>
          <button
            className="text-link"
            onClick={() => {
              onSetCategory("For you")
              onOpenSection("discover")
            }}
          >
            View all categories <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="category-grid">
          {categories
            .slice(1)
            .concat([{ name: "More categories", icon: "grid" }])
            .map((c, i) => (
              <button
                key={c.name}
                onClick={() => {
                  onSetCategory(
                    c.name === "More categories" ? "For you" : c.name,
                  )
                  onOpenSection("discover")
                }}
              >
                <span className={`category-icon category-color-${i}`}>
                  <Icon name={c.icon} size={30} />
                </span>
                <span>{c.name}</span>
              </button>
            ))}
        </div>
      </section>
      <section className="flash-section" id="flash-sale">
        <div className="section-heading">
          <div className="flash-heading">
            <span className="flash-bolt">
              <Icon name="bolt" size={26} />
            </span>
            <div>
              <h2>Good deals. Gone soon.</h2>
              <p>Your favorites, at blink-and-you-miss-it prices.</p>
            </div>
            <div className="countdown">
              <span>Ends in</span>
              {[
                Math.floor(seconds / 3600),
                Math.floor(seconds / 60) % 60,
                seconds % 60,
              ].map((n, i) => (
                <span className="time-part" key={i}>
                  <b>{String(n).padStart(2, "0")}</b>
                  {i < 2 && <i>:</i>}
                </span>
              ))}
            </div>
          </div>
          <button
            className="text-link"
            onClick={() => {
              onSetTab("Best sellers")
              onOpenSection("discover")
            }}
          >
            All flash deals <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="product-grid flash-grid">
          {products.slice(0, 6).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              flash={true}
              isSaved={saved.includes(p.id)}
              onToggleSave={onToggleSave}
              onAddToCart={onAddToCart}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>
      <section className="discover-section" id="discover">
        <div className="section-heading">
          <div>
            <h2>
              {showSaved
                ? "Your saved finds"
                : query
                  ? `Results for “${query}”`
                  : category !== "For you"
                    ? category
                    : "Made for your kind of everyday."}
            </h2>
            <p>
              {showSaved
                ? "All the things you've had your eye on."
                : "A few things we think you'll love. And a few happy surprises."}
            </p>
          </div>
          <span className="curated">
            <Icon name="grid" size={15} /> Curated for you
          </span>
        </div>
        <div className="tabs">
          {["For you", "Best sellers", "New arrivals", "Under Rp100k"].map(
            (t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => onSetTab(t)}
              >
                {t}
              </button>
            ),
          )}
        </div>
        <div className="product-grid">
          {recommended.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSaved={saved.includes(p.id)}
              onToggleSave={onToggleSave}
              onAddToCart={onAddToCart}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
        {recommended.length === 0 && (
          <div className="empty-state">
            <Icon name="search" size={35} />
            <h3>No finds just yet</h3>
            <p>Try a different search or explore another category.</p>
            <button onClick={onResetQuery}>Explore all products</button>
          </div>
        )}
      </section>
      <footer>
        <a className="logo" href="#" onClick={onNavigateShop}>
          pasar<span>.</span>
        </a>
        <p>A little discovery. A lot to love.</p>
        <span>© 2026 pasar. Your everyday marketplace.</span>
      </footer>
    </div>
  )
}
