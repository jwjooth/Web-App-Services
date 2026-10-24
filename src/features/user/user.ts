export type UserProfile = { name: string; email: string; phone: string; birthday: string };
export type Address = {
  id: number;
  label: string;
  recipient: string;
  street: string;
  city: string;
  postal: string;
};
export const demoUser: UserProfile = {
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "+62 812 3456 7890",
  birthday: "1998-06-15",
};
export const demoAddresses: Address[] = [
  {
    id: 1,
    label: "Home",
    recipient: "Alex Morgan",
    street: "Jl. Senopati No. 24, Kebayoran Baru",
    city: "Jakarta Selatan",
    postal: "12310",
  },
  {
    id: 2,
    label: "Office",
    recipient: "Alex Morgan",
    street: "Jl. Jenderal Sudirman No. 52",
    city: "Jakarta Pusat",
    postal: "12190",
  },
];
