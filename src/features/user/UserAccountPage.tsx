import { useState } from "react";
import Icon from "@/components/Icon";
import { demoAddresses, demoUser, type Address, type UserProfile } from "./user";
import AddressModal from "./AddressModal";

type Props = {
  notify: (message: string) => void;
};

type UserTab = "Personal details" | "Delivery addresses" | "Preferences";

const TABS: { name: UserTab; icon: "bag" | "pin" | "bell" }[] = [
  { name: "Personal details", icon: "bag" },
  { name: "Delivery addresses", icon: "pin" },
  { name: "Preferences", icon: "bell" },
];

const PREFERENCE_ITEMS = [
  {
    key: "orders" as const,
    title: "Order updates",
    text: "Payment confirmations, delivery progress, and order news.",
  },
  {
    key: "offers" as const,
    title: "Good deals & offers",
    text: "Flash sales, little perks, and vouchers worth opening.",
  },
  {
    key: "recommendations" as const,
    title: "Made-for-you recommendations",
    text: "Fresh finds inspired by the things you love.",
  },
];

export default function UserAccountPage({ notify }: Props) {
  const [userTab, setUserTab] = useState<UserTab>("Personal details");
  const [profile, setProfile] = useState<UserProfile>(demoUser);
  const [draft, setDraft] = useState<UserProfile>(demoUser);
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [defaultAddress, setDefaultAddress] = useState<number>(1);
  const [addressDraft, setAddressDraft] = useState<Address | null>(null);
  const [preferences, setPreferences] = useState({
    orders: true,
    offers: false,
    recommendations: true,
  });

  function handleSaveAddress(saved: Address) {
    setAddresses((current) =>
      current.some((a) => a.id === saved.id)
        ? current.map((a) => (a.id === saved.id ? saved : a))
        : [...current, saved],
    );
    setAddressDraft(null);
    notify("Address saved for this session only.");
  }

  return (
    <div className="account-layout">
      <aside className="account-nav">
        <div className="account-avatar">{profile.name.charAt(0)}</div>
        <h2>{profile.name}</h2>
        <span>Everyday explorer</span>
        <div className="member-badge">
          <Icon name="shield" size={13} />
          Pasar member · Demo
        </div>
        {TABS.map((t) => (
          <button
            key={t.name}
            className={userTab === t.name ? "active" : ""}
            onClick={() => setUserTab(t.name)}
          >
            <Icon name={t.icon} size={18} />
            {t.name}
            <Icon name="chevron" size={14} />
          </button>
        ))}
      </aside>

      <section className="service-panel account-panel">
        <div className="service-panel-top">
          <div>
            <h2>{userTab}</h2>
            <p>
              {userTab === "Personal details"
                ? "Keep your everyday details up to date."
                : userTab === "Delivery addresses"
                  ? "Good finds, delivered to the right place."
                  : "Make pasar feel a little more like you."}
            </p>
          </div>
          {userTab === "Delivery addresses" && (
            <button
              className="service-solid"
              onClick={() =>
                setAddressDraft({
                  id: Date.now(),
                  label: "",
                  recipient: profile.name,
                  street: "",
                  city: "",
                  postal: "",
                })
              }
            >
              <Icon name="plus" size={15} />
              Add address
            </button>
          )}
        </div>

        {userTab === "Personal details" && (
          <form
            className="account-form"
            onSubmit={(e) => {
              e.preventDefault();
              setProfile(draft);
              notify("Profile updated for this session only. User API is not connected.");
            }}
          >
            <div className="profile-summary">
              <span className="small-avatar">{profile.name.charAt(0)}</span>
              <div>
                <strong>Your personal profile</strong>
                <p>Only you can see and edit these details.</p>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Full name
                <input
                  required
                  maxLength={80}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                Email address
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </label>
              <label>
                Phone number
                <input
                  required
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </label>
              <label>
                Birthday <span>(optional)</span>
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(e) => setDraft({ ...draft, birthday: e.target.value })}
                />
              </label>
            </div>
            <div className="account-info">
              <Icon name="shield" size={20} />
              <p>
                This is a preview account. Changes stay in this session and reset on reload. No
                authentication or personal data is sent to a server.
              </p>
            </div>
            <div className="form-actions">
              <button type="button" className="service-outline" onClick={() => setDraft(profile)}>
                Discard changes
              </button>
              <button className="service-solid" type="submit">
                Save changes
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </form>
        )}

        {userTab === "Delivery addresses" && (
          <div className="address-list">
            {addresses.map((a) => (
              <article className="address-card" key={a.id}>
                <div>
                  <span className="address-icon">
                    <Icon name={a.label === "Home" ? "home" : "pin"} size={20} />
                  </span>
                  <h3>{a.label}</h3>
                  {defaultAddress === a.id && <span className="store-label">Default address</span>}
                </div>
                <strong>{a.recipient}</strong>
                <p>
                  {a.street}
                  <br />
                  {a.city}, {a.postal}
                  <br />
                  Indonesia
                </p>
                <div className="address-actions">
                  <button onClick={() => setAddressDraft({ ...a })}>Edit address</button>
                  {defaultAddress !== a.id && (
                    <>
                      <button
                        onClick={() => {
                          setDefaultAddress(a.id);
                          notify("Default address changed for this demo session.");
                        }}
                      >
                        Set as default
                      </button>
                      <button
                        onClick={() =>
                          setAddresses((current) => current.filter((item) => item.id !== a.id))
                        }
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {userTab === "Preferences" && (
          <div className="preferences-list">
            {PREFERENCE_ITEMS.map((p) => (
              <div className="preference-row" key={p.key}>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences[p.key]}
                  aria-label={p.title}
                  className={`toggle ${preferences[p.key] ? "on" : ""}`}
                  onClick={() => {
                    setPreferences((current) => ({
                      ...current,
                      [p.key]: !current[p.key],
                    }));
                    notify("Preference updated locally. No notifications will be sent.");
                  }}
                >
                  <span />
                </button>
              </div>
            ))}
            <div className="account-info">
              <Icon name="help" size={20} />
              <p>
                Preferences are preview-only. Notification delivery will be available when your User
                service is connected.
              </p>
            </div>
          </div>
        )}
      </section>

      {addressDraft && (
        <AddressModal
          draft={addressDraft}
          onChange={setAddressDraft}
          onSave={handleSaveAddress}
          onClose={() => setAddressDraft(null)}
        />
      )}
    </div>
  );
}
