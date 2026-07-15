export interface Product {
  id: string;
  _id?: any;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isLimited: boolean;
  description: string;
  specs: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock?: number;
  sku?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  _id?: any;
  customer: string;
  segment: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  userId?: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  category?: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}
