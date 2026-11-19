
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="catalog-card">
      <Link
        href={`/products/${product.slug}`}
        className="catalog-card-link"
      >
        <div className="catalog-image-wrap">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 650px) 50vw, (max-width: 1000px) 33vw, 25vw"
            className="catalog-image"
          />

          {product.tag && (
            <span className="catalog-tag">{product.tag}</span>
          )}

          <span className="catalog-view">VIEW PIECE ↗</span>
        </div>

        <div className="catalog-product-info">
          <div>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
          </div>

          <strong>
            KSh {product.price.toLocaleString("en-KE")}
          </strong>
        </div>
      </Link>
    </article>
  );
}
