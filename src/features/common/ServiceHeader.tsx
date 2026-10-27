import Icon from "@/components/Icon";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function ServiceHeader({ eyebrow, title, description }: Props) {
  return (
    <>
      <div className="service-title">
        <div>
          <span className="service-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="demo-pill">
          <span />
          Demo data · Backend coming soon
        </span>
      </div>
    </>
  );
}

export function ServiceFooterNote() {
  return (
    <div className="service-note">
      <Icon name="shield" size={16} />
      <span>
        Thoughtfully built for what’s next. All records and actions on this page are frontend
        demonstrations.
      </span>
    </div>
  );
}
