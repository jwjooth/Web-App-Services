import Icon from "./Icon"

export interface CategoryType {
  name: string
  icon: string
}

export interface SidebarProps {
  categories: CategoryType[]
  category: string
  showSaved: boolean
  onSelectCategory: (name: string) => void
  onOpenSection: (id: string) => void
  onSetTab: (tab: string) => void
  onSetNotice: (msg: string) => void
}

export default function Sidebar({
  categories,
  category,
  showSaved,
  onSelectCategory,
  onOpenSection,
  onSetTab,
  onSetNotice,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="deliver">
        <span className="pin-box">
          <Icon name="pin" size={20} />
        </span>
        <div>
          <small>Deliver to</small>
          <button
            onClick={() =>
              onSetNotice(
                "Delivery preview: Jakarta, 12310. Address selection will connect to your shipping service.",
              )
            }
          >
            Jakarta, 12310 <Icon name="down" size={13} />
          </button>
        </div>
      </div>
      <div className="sidebar-title">EXPLORE MARKETPLACE</div>
      <nav>
        {categories.map((c) => (
          <button
            key={c.name}
            className={category === c.name && !showSaved ? "selected" : ""}
            onClick={() => onSelectCategory(c.name)}
          >
            <Icon name={c.icon} size={20} />
            {c.name}
            {c.name !== "For you" && <Icon name="chevron" size={13} />}
          </button>
        ))}
      </nav>
      <div className="sidebar-line" />
      <nav>
        <button onClick={() => onOpenSection("flash-sale")}>
          <Icon name="bolt" />
          <span>Flash deals</span>
          <span className="hot">HOT</span>
        </button>
        <button
          onClick={() => {
            onSetTab("Best sellers")
            onOpenSection("discover")
          }}
        >
          <Icon name="shield" />
          Official stores
          <Icon name="chevron" size={13} />
        </button>
        <button
          onClick={() =>
            onSetNotice(
              "Use code HELLOPASAR for 10% off your first order. Demo offer only.",
            )
          }
        >
          <Icon name="gift" />
          Vouchers & offers
        </button>
      </nav>
      <div className="seller-promo">
        <span className="seller-icon">
          <Icon name="bag" size={22} />
        </span>
        <h3>
          Your next big thing
          <br />
          starts here.
        </h3>
        <p>
          Open your shop and reach
          <br />
          millions of happy shoppers.
        </p>
        <button
          onClick={() =>
            onSetNotice(
              "Seller registration will be available when your seller service is connected.",
            )
          }
        >
          Start selling <Icon name="arrow" size={15} />
        </button>
      </div>
      <button
        className="need-help"
        onClick={() =>
          onSetNotice("We're here to help. Contact hello@pasar.example")
        }
      >
        <Icon name="help" size={18} />
        Need a little help?
        <Icon name="arrow" size={15} />
      </button>
    </aside>
  )
}
