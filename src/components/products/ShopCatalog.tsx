
"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type ShopCatalogProps = {
  products: Product[];
};

export default function ShopCatalog({ products }: ShopCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");

  const categories = [
    "All",
    "T-Shirts",
    "Hoodies",
    "Accessories",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter(
        (product) => product.category === activeCategory
      );
    }

    if (sortOrder === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortOrder === "featured") {
      result.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [products, activeCategory, sortOrder]);

  return (
    <div>
      <div className="shop-toolbar">
        <div className="shop-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "shop-filter active"
                  : "shop-filter"
              }
            >
              {category}
            </button>
          ))}
        </div>

        <label className="shop-sort">
          <SlidersHorizontal size={16} />

          <span>Sort:</span>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
          </select>
        </label>
      </div>

      <div className="shop-result-count">
        SHOWING {filteredProducts.length} PIECES
      </div>

      {filteredProducts.length > 0 ? (
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          No pieces found in this category.
        </div>
      )}
    </div>
  );
}
