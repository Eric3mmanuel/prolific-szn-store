
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

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

const CART_KEY = "prolific-szn-cart";

function readCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      return (
        item &&
        typeof item.productId === "string" &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image === "string" &&
        typeof item.size === "string" &&
        typeof item.color === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.price) &&
        Number.isFinite(item.quantity) &&
        item.price >= 0 &&
        item.quantity >= 1
      );
    });
  } catch {
    return [];
  }
}

function formatPrice(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveCart = useCallback((nextItems: CartItem[]) => {
    setItems(nextItems);
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event("prolific-cart-updated"));
  }, []);

  useEffect(() => {
    setItems(readCart());
    setIsLoaded(true);

    const syncCart = () => {
      setItems(readCart());
    };

    window.addEventListener("storage", syncCart);
    window.addEventListener("prolific-cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("prolific-cart-updated", syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  function updateQuantity(index: number, change: number) {
    const nextItems = [...items];
    const updatedQuantity = nextItems[index].quantity + change;

    if (updatedQuantity < 1) return;

    nextItems[index] = {
      ...nextItems[index],
      quantity: updatedQuantity,
    };

    saveCart(nextItems);
  }

  function removeItem(index: number) {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
    saveCart(nextItems);
  }

  if (!isLoaded) {
    return (
      <main className="cart-page">
        <div className="cart-loading">
          <span className="eyebrow">PROLIFIC SZN</span>
          <p>LOADING YOUR BAG...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={34} strokeWidth={1.3} />
          </div>

          <span className="eyebrow">YOUR BAG IS WAITING</span>

          <h1>NOTHING IN<br />THE BAG. YET.</h1>

          <p>
            Your next favourite piece is waiting to be discovered.
            Explore the collection and find something that speaks to you.
          </p>

          <Link href="/shop" className="cart-primary-button">
            EXPLORE THE COLLECTION
            <ArrowRight size={18} />
          </Link>

          <Link href="/" className="cart-back-home">
            BACK TO HOME
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-topline">
          <Link href="/shop" className="cart-back-link">
            <ArrowLeft size={16} />
            CONTINUE SHOPPING
          </Link>

          <span className="eyebrow">PROLIFIC SZN — YOUR BAG</span>
        </div>

        <div className="cart-heading">
          <div>
            <span className="eyebrow">ALMOST YOURS</span>
            <h1>YOUR BAG<span>.</span></h1>
          </div>

          <p>
            {totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"} SELECTED
          </p>
        </div>

        <div className="cart-layout">
          <section className="cart-items">
            <div className="cart-column-heading">
              <span>PRODUCT DETAILS</span>
              <span>SUBTOTAL</span>
            </div>

            {items.map((item, index) => (
              <article
                className="cart-item"
                key={`${item.productId}-${item.size}-${item.color}`}
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="cart-item-image"
                  style={{ backgroundImage: `url("${item.image}")` }}
                  aria-label={`View ${item.name}`}
                />

                <div className="cart-item-details">
                  <span className="cart-item-category">PROLIFIC SZN</span>

                  <Link
                    href={`/products/${item.slug}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  <p className="cart-item-variant">
                    SIZE: {item.size} <span>/</span> COLOUR: {item.color}
                  </p>

                  <p className="cart-item-unit-price">
                    {formatPrice(item.price)}
                  </p>

                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={13} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(index, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 size={14} />
                      REMOVE
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <span className="eyebrow">THE BREAKDOWN</span>
            <h2>ORDER SUMMARY</h2>

            <div className="cart-summary-line">
              <span>Items ({totalQuantity})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-summary-line">
              <span>Delivery</span>
              <span className="cart-summary-note">CALCULATED AT CHECKOUT</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-total-line">
              <span>SUBTOTAL</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <p className="cart-summary-disclaimer">
              Delivery charges will be confirmed during checkout.
            </p>

            <Link href="/checkout" className="cart-checkout-button">
              PROCEED TO CHECKOUT
              <ArrowRight size={18} />
            </Link>

            <div className="cart-summary-footer">
              <span>01</span>
              <p>INDEPENDENT STREETWEAR.</p>
            </div>

            <div className="cart-summary-footer">
              <span>02</span>
              <p>MADE FOR THOSE WHO REFUSE TO FIT THE NORM.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
