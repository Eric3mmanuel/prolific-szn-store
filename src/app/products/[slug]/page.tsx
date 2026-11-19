
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/products";
import ProductDetails from "@/components/products/product-details";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="product-not-found">
        <span className="eyebrow">404 — PRODUCT NOT FOUND</span>

        <h1>THIS PIECE ISN'T HERE.</h1>

        <p>
          The product may have moved, or it may not be part
          of this collection.
        </p>

        <Link href="/shop" className="primary-button">
          RETURN TO THE COLLECTION
        </Link>
      </main>
    );
  }

  return <ProductDetails product={product} />;
}
