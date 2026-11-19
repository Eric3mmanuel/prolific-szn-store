
export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  sizes: string[];
  colors: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "The Outcast Tee",
    slug: "the-outcast-tee",
    category: "T-Shirts",
    description:
      "A statement piece for those who refuse to follow the crowd. Designed for everyday expression and effortless streetwear styling.",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
    tag: "BESTSELLER",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
  },
  {
    id: "2",
    name: "Szn Oversized Fit",
    slug: "szn-oversized-fit",
    category: "T-Shirts",
    description:
      "Relaxed proportions. Uncompromising attitude. An everyday essential made for a different kind of individual.",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=85",
    tag: "NEW DROP",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
  },
  {
    id: "3",
    name: "After Hours Hoodie",
    slug: "after-hours-hoodie",
    category: "Hoodies",
    description:
      "Built for late nights and early ambitions. A streetwear essential with a bold, relaxed silhouette.",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
    tag: "LIMITED",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Red"],
  },
  {
    id: "4",
    name: "The Essential Layer",
    slug: "the-essential-layer",
    category: "Hoodies",
    description:
      "A versatile layer with a clean silhouette and a strong identity. Made to be worn your way.",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
  },
  {
    id: "5",
    name: "Szn Everyday Cap",
    slug: "szn-everyday-cap",
    category: "Accessories",
    description:
      "The finishing touch. A clean everyday accessory for those who understand the details.",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85",
    tag: "ESSENTIAL",
    sizes: ["One Size"],
    colors: ["Black"],
  },
  {
    id: "6",
    name: "The Statement Tee",
    slug: "the-statement-tee",
    category: "T-Shirts",
    description:
      "A graphic-led everyday piece that says enough without saying too much.",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=85",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
  },
];
