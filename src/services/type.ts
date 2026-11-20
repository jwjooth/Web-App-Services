export type Product = {
  id: number
  name: string
  price: number
  original: number
  image: string
  category: string
  rating: string
  sold: string
  city: string
  tag?: string
}

export type OrderStatus = "To pay" | "Processing" | "In transit" | "Delivered" | "Cancelled"

export type Order = {
  id: string
  date: string
  status: OrderStatus
  product: Product
  quantity: number
  delivery: string
}

export type UserProfile = {
  name: string
  email: string
  phone: string
  birthday: string
}

export type Address = {
  id: number
  label: string
  recipient: string
  street: string
  city: string
  postal: string
}
