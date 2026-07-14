export interface Product {
  id: string;
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
}

export interface Order {
  id: string;
  customer: string;
  segment: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}
