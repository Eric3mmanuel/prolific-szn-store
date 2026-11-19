
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const newItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    try {
      const savedCart = localStorage.getItem("prolific-szn-cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem("prolific-szn-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("prolific-cart-updated"));
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2500);
    } catch {
      alert("We couldn't save your cart. Please try again.");
    }
  }

  return (
    <main className="product-page">
      <div className="container product-page-container">
        <Link href="/shop" className="product-back-link">
          <ArrowLeft size={16} />
          BACK TO COLLECTION
        </Link>

        <div className="product-layout">
          <section className="product-gallery">
            <div
              className="product-main-image"
              style={{ backgroundImage: `url("${product.image}")` }}
              role="img"
              aria-label={product.name}
            >
              {product.tag && (
                <span className="product-image-tag">{product.tag}</span>
              )}
              <span className="product-image-index">01 / 01</span>
            </div>

            <div className="product-gallery-caption">
              <span>PROLIFIC SZN — PRODUCT ARCHIVE</span>
              <span>DESIGNED TO STAND OUT.</span>
            </div>
          </section>

          <section className="product-information">
            <span className="eyebrow">{product.category}</span>

            <h1 className="product-detail-title">{product.name}</h1>

            <p className="product-detail-price">
              KSh {product.price.toLocaleString("en-KE")}
            </p>

            <div className="product-detail-divider" />

            <p className="product-description">{product.description}</p>

            <div className="product-option">
              <div className="product-option-heading">
                <span>SELECT SIZE</span>
                <span>{selectedSize}</span>
              </div>

              <div className="product-size-options">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={
                      selectedSize === size
                        ? "product-size-button selected"
                        : "product-size-button"
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-option">
              <div className="product-option-heading">
                <span>SELECT COLOUR</span>
                <span>{selectedColor}</span>
              </div>

              <div className="product-color-options">
                {product.colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={
                      selectedColor === color
                        ? "product-color-button selected"
                        : "product-color-button"
                    }
                  >
                    <span className="color-dot" />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-option">
              <div className="product-option-heading">
                <span>QUANTITY</span>
                <span>{quantity} ITEM{quantity > 1 ? "S" : ""}</span>
              </div>

              <div className="product-quantity-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="product-add-button"
              onClick={addToCart}
              disabled={!selectedSize || !selectedColor}
            >
              <span>
                {added ? "ADDED TO YOUR BAG" : "ADD TO BAG"}
              </span>
              {added ? <ShoppingBag size={19} /> : <ArrowRight size={19} />}
            </button>

            {added && (
  <div className="product-added-panel">
    <p>Your selection has been saved to your shopping bag.</p>
    <Link href="/cart">
      VIEW YOUR BAG <ArrowRight size={15} />
    </Link>
  </div>
)}

            <div className="product-detail-divider" />

            <div className="product-promise">
              <span>01</span>
              <div>
                <strong>MADE TO MAKE A STATEMENT</strong>
                <p>Independent streetwear for those who refuse to fit the norm.</p>
              </div>
            </div>

            <div className="product-promise">
              <span>02</span>
              <div>
                <strong>NEED HELP?</strong>
                <p>Get in touch with the Prolific Szn team for product enquiries.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
