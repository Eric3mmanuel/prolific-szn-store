
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  featured?: boolean;
  tag?: string;
};

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};
