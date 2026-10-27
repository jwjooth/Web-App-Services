import Icon from "@/components/Icon";
import type { Address } from "./user";

type Props = {
  draft: Address;
  onChange: (draft: Address) => void;
  onSave: (address: Address) => void;
  onClose: () => void;
};

const ADDRESS_FIELDS = [
  { key: "label", label: "Label (e.g. Home)" },
  { key: "recipient", label: "Recipient" },
  { key: "street", label: "Street address" },
  { key: "city", label: "City" },
  { key: "postal", label: "Postal code" },
] as const;

export default function AddressModal({ draft, onChange, onSave, onClose }: Props) {
  return (
    <div className="overlay product-overlay" onClick={onClose}>
      <section
        className="tracking-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Edit delivery address"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>Delivery address</h2>
          <button aria-label="Close address form" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <form
          className="address-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          {ADDRESS_FIELDS.map((f) => (
            <label key={f.key}>
              {f.label}
              <input
                required
                maxLength={160}
                value={draft[f.key]}
                onChange={(e) => onChange({ ...draft, [f.key]: e.target.value })}
              />
            </label>
          ))}
          <button className="primary-button" type="submit">
            Save demo address
          </button>
        </form>
      </section>
    </div>
  );
}
