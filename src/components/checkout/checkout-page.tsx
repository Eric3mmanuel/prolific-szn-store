
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
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

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  county: string;
  town: string;
  address: string;
  landmark: string;
  mpesaPhone: string;
};

type CreatedOrder = {
  id: string;
  orderNumber: string;
  subtotal: number;
  paymentStatus: string;
  createdAt: string;
};

const CART_KEY = "prolific-szn-cart";

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  county: "",
  town: "",
  address: "",
  landmark: "",
  mpesaPhone: "",
};

function formatPrice(price: number) {
  return `KSh ${price.toLocaleString("en-KE")}`;
}

function readCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.productId === "string" &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image === "string" &&
        typeof item.size === "string" &&
        typeof item.color === "string" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  useEffect(() => {
    setItems(readCart());
    setIsLoaded(true);
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
    setItems((current) => {
      const updated = [...current];
      const nextQuantity = updated[index].quantity + change;

      if (nextQuantity < 1 || nextQuantity > 10) return current;

      updated[index] = {
        ...updated[index],
        quantity: nextQuantity,
      };

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("prolific-cart-updated"));

      return updated;
    });
  }

  function removeItem(index: number) {
    setItems((current) => {
      const updated = current.filter((_, itemIndex) => itemIndex !== index);

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("prolific-cart-updated"));

      return updated;
    });
  }

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setFormMessage("Your shopping bag is empty.");
      return;
    }

    setIsSubmitting(true);
    setFormMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
          },
          delivery: {
            county: form.county,
            town: form.town,
            address: form.address,
            landmark: form.landmark,
          },
          mpesaPhone: form.mpesaPhone,
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      const result: {
        success?: boolean;
        error?: string;
        order?: CreatedOrder;
      } = await response.json();

      if (!response.ok || !result.success || !result.order) {
        throw new Error(result.error || "We could not create your order.");
      }

      setCreatedOrder(result.order);

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("prolific-cart-updated"));
      setItems([]);
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="ps-checkout-page">
        <div className="ps-checkout-loading">PREPARING YOUR CHECKOUT...</div>
        <CheckoutStyles />
      </main>
    );
  }

  if (createdOrder) {
    return (
      <main className="ps-checkout-page">
        <header className="ps-checkout-header">
          <Link href="/shop" className="ps-checkout-logo">
            PROLIFIC<span>SZN.</span>
          </Link>
          <div className="ps-checkout-secure">
            <LockKeyhole size={14} />
            SECURE CHECKOUT
          </div>
        </header>

        <section className="ps-success-wrap">
          <div className="ps-success-icon">
            <CheckCircle2 size={36} />
          </div>

          <span className="ps-eyebrow">ORDER RECEIVED</span>
          <h1>YOU'RE ONE STEP CLOSER.</h1>

          <p className="ps-success-copy">
            Your order has been saved. Your payment has not yet been
            processed. We will proceed with payment once M-PESA checkout
            is connected.
          </p>

          <div className="ps-order-reference">
            <span>YOUR ORDER REFERENCE</span>
            <strong>{createdOrder.orderNumber}</strong>
          </div>

          <div className="ps-success-details">
            <div>
              <span>ORDER TOTAL</span>
              <strong>{formatPrice(createdOrder.subtotal)}</strong>
            </div>
            <div>
              <span>PAYMENT STATUS</span>
              <strong className="ps-pending">PENDING PAYMENT</strong>
            </div>
          </div>

          <Link href="/shop" className="ps-primary-button">
            CONTINUE SHOPPING <ArrowRight size={17} />
          </Link>

          <p className="ps-success-note">
            Thank you for choosing Prolific Szn. Dare to be great.
          </p>
        </section>

        <CheckoutStyles />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="ps-checkout-page">
        <header className="ps-checkout-header">
          <Link href="/shop" className="ps-checkout-logo">
            PROLIFIC<span>SZN.</span>
          </Link>
          <div className="ps-checkout-secure">
            <LockKeyhole size={14} />
            SECURE CHECKOUT
          </div>
        </header>

        <section className="ps-empty-checkout">
          <div className="ps-empty-icon">
            <ShoppingBag size={30} />
          </div>
          <span className="ps-eyebrow">YOUR BAG IS WAITING</span>
          <h1>NOTHING IN HERE. YET.</h1>
          <p>Discover pieces made for those who refuse to follow the norm.</p>
          <Link href="/shop" className="ps-primary-button">
            EXPLORE THE COLLECTION <ArrowRight size={17} />
          </Link>
        </section>

        <CheckoutStyles />
      </main>
    );
  }

  return (
    <main className="ps-checkout-page">
      <header className="ps-checkout-header">
        <Link href="/shop" className="ps-checkout-logo">
          PROLIFIC<span>SZN.</span>
        </Link>

        <div className="ps-checkout-secure">
          <LockKeyhole size={14} />
          SECURE CHECKOUT
        </div>
      </header>

      <div className="ps-checkout-container">
        <div className="ps-checkout-intro">
          <Link href="/cart" className="ps-back-link">
            <ArrowLeft size={15} />
            BACK TO YOUR BAG
          </Link>

          <span className="ps-eyebrow">ALMOST YOURS</span>
          <h1>CHECKOUT<span>.</span></h1>
          <p>One final step. Make it yours.</p>
        </div>

        <div className="ps-checkout-grid">
          <form className="ps-checkout-form" onSubmit={handleSubmit}>
            <section className="ps-form-section">
              <div className="ps-section-heading">
                <div className="ps-section-number">01</div>
                <div>
                  <h2>YOUR DETAILS</h2>
                  <p>Who are we delivering to?</p>
                </div>
              </div>

              <div className="ps-field-grid">
                <label className="ps-field ps-field-full">
                  <span>FULL NAME *</span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="ps-field">
                  <span>EMAIL ADDRESS *</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="ps-field">
                  <span>PHONE NUMBER *</span>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="07XX XXX XXX"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>
            </section>

            <section className="ps-form-section">
              <div className="ps-section-heading">
                <div className="ps-section-number">02</div>
                <div>
                  <h2>DELIVERY ADDRESS</h2>
                  <p>Where should your pieces find you?</p>
                </div>
              </div>

              <div className="ps-field-grid">
                <label className="ps-field">
                  <span>COUNTY *</span>
                  <select
                    name="county"
                    value={form.county}
                    onChange={updateField}
                    required
                  >
                    <option value="">Select your county</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ps-field">
                  <span>TOWN / CITY *</span>
                  <input
                    name="town"
                    value={form.town}
                    onChange={updateField}
                    placeholder="e.g. Nairobi"
                    required
                  />
                </label>

                <label className="ps-field ps-field-full">
                  <span>DELIVERY ADDRESS *</span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    placeholder="Building, street, estate or area"
                    required
                  />
                </label>

                <label className="ps-field ps-field-full">
                  <span>LANDMARK / EXTRA DIRECTIONS</span>
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={updateField}
                    placeholder="Nearby landmark (optional)"
                  />
                </label>
              </div>
            </section>

            <section className="ps-form-section">
              <div className="ps-section-heading">
                <div className="ps-section-number">03</div>
                <div>
                  <h2>PAYMENT METHOD</h2>
                  <p>Simple, secure and convenient.</p>
                </div>
              </div>

              <div className="ps-payment-option">
                <div className="ps-payment-top">
                  <div className="ps-mpesa-mark">M</div>
                  <div className="ps-payment-name">
                    <strong>M-PESA</strong>
                    <span>Pay securely using Safaricom M-PESA</span>
                  </div>
                  <div className="ps-selected-indicator" />
                </div>

                <label className="ps-field ps-mpesa-field">
                  <span>M-PESA PHONE NUMBER *</span>
                  <input
                    name="mpesaPhone"
                    type="tel"
                    value={form.mpesaPhone}
                    onChange={updateField}
                    placeholder="07XX XXX XXX"
                    required
                  />
                </label>

                <p className="ps-payment-note">
                  M-PESA payment requests will be enabled when the payment
                  integration is connected. Submitting this form currently
                  saves your order without charging you.
                </p>
              </div>
            </section>

            {formMessage && (
              <div className="ps-form-error" role="alert">
                {formMessage}
              </div>
            )}

            <button
              type="submit"
              className="ps-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "SAVING YOUR ORDER..."
              ) : (
                <>
                  PLACE YOUR ORDER <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="ps-checkout-assurance">
              <ShieldCheck size={16} />
              YOUR DETAILS ARE SUBMITTED SECURELY
            </div>
          </form>

          <aside className="ps-order-panel">
            <div className="ps-order-panel-heading">
              <div>
                <span className="ps-eyebrow">THE GOOD STUFF</span>
                <h2>YOUR ORDER</h2>
              </div>
              <span className="ps-item-count">
                {totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"}
              </span>
            </div>

            <div className="ps-order-items">
              {items.map((item, index) => (
                <div
                  className="ps-order-item"
                  key={`${item.productId}-${item.size}-${item.color}-${index}`}
                >
                  <div className="ps-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="ps-item-info">
                    <strong>{item.name}</strong>
                    <span>
                      {item.color} / {item.size}
                    </span>
                    <div className="ps-quantity-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={item.quantity >= 10}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="ps-item-price">
                    {formatPrice(item.price * item.quantity)}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ps-remove-item"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-order-calculations">
              <div>
                <span>SUBTOTAL</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>DELIVERY</span>
                <strong className="ps-delivery-pending">CONFIRMED LATER</strong>
              </div>
            </div>

            <div className="ps-order-total">
              <span>TOTAL</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <p className="ps-delivery-disclaimer">
              Delivery charges, if applicable, will be confirmed before
              payment is collected.
            </p>

            <div className="ps-order-promise">
              <Truck size={18} />
              <div>
                <strong>MADE TO MOVE WITH YOU.</strong>
                <span>Delivery details will be confirmed with your order.</span>
              </div>
            </div>

            <div className="ps-order-secure">
              <MapPin size={15} />
              DELIVERING ACROSS KENYA
            </div>
          </aside>
        </div>

        <footer className="ps-checkout-footer">
          <span>PROLIFIC SZN. © 2026</span>
          <span>DARE TO BE GREAT.</span>
        </footer>
      </div>

      <CheckoutStyles />
    </main>
  );
}

function CheckoutStyles() {
  return (
    <style jsx global>{`
      .ps-checkout-page {
        min-height: 100vh;
        background: #090909;
        color: #f4f1ed;
        font-family: var(--font-space-grotesk), Arial, sans-serif;
        padding-bottom: 60px;
      }

      .ps-checkout-page * {
        box-sizing: border-box;
      }

      .ps-checkout-page button,
      .ps-checkout-page input,
      .ps-checkout-page select {
        font: inherit;
      }

      .ps-checkout-header {
        width: 100%;
        min-height: 78px;
        padding: 0 7%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #242424;
      }

      .ps-checkout-logo {
        color: #fff;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 25px;
        letter-spacing: -0.7px;
        text-decoration: none;
      }

      .ps-checkout-logo span {
        color: #ed202b;
      }

      .ps-checkout-secure {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #aaa;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.4px;
      }

      .ps-checkout-secure svg {
        color: #ed202b;
      }

      .ps-checkout-container {
        width: min(1160px, 88%);
        margin: 0 auto;
      }

      .ps-checkout-intro {
        padding: 52px 0 35px;
      }

      .ps-back-link {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        margin-bottom: 38px;
        color: #a5a5a5;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .ps-back-link:hover {
        color: #fff;
      }

      .ps-eyebrow {
        display: block;
        color: #ed202b;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 2.5px;
      }

      .ps-checkout-intro h1,
      .ps-success-wrap h1,
      .ps-empty-checkout h1 {
        margin: 8px 0 5px;
        color: #fff;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: clamp(48px, 7vw, 76px);
        font-weight: 400;
        line-height: 0.98;
        letter-spacing: -1px;
      }

      .ps-checkout-intro h1 span {
        color: #ed202b;
      }

      .ps-checkout-intro > p {
        margin: 13px 0 0;
        color: #929292;
        font-size: 14px;
      }

      .ps-checkout-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
        align-items: start;
        gap: 38px;
      }

      .ps-checkout-form {
        min-width: 0;
      }

      .ps-form-section {
        margin-bottom: 22px;
        padding: 28px;
        border: 1px solid #292929;
        border-radius: 4px;
        background: #111;
      }

      .ps-section-heading {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 26px;
      }

      .ps-section-number {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border: 1px solid #ed202b;
        color: #ed202b;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 17px;
      }

      .ps-section-heading h2 {
        margin: 0;
        color: #fff;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 21px;
        font-weight: 400;
        letter-spacing: 0.4px;
      }

      .ps-section-heading p {
        margin: 4px 0 0;
        color: #888;
        font-size: 12px;
      }

      .ps-field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 19px 15px;
      }

      .ps-field {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .ps-field-full {
        grid-column: 1 / -1;
      }

      .ps-field > span {
        color: #bdbdbd;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.25px;
      }

      .ps-field input,
      .ps-field select {
        width: 100%;
        height: 49px;
        min-width: 0;
        padding: 0 14px;
        outline: none;
        border: 1px solid #343434;
        border-radius: 2px;
        background: #090909;
        color: #f4f1ed;
        font-size: 12px;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      .ps-field input::placeholder {
        color: #656565;
      }

      .ps-field select {
        color-scheme: dark;
      }

      .ps-field input:focus,
      .ps-field select:focus {
        border-color: #ed202b;
        background: #0d0d0d;
      }

      .ps-payment-option {
        padding: 19px;
        border: 1px solid #383838;
        border-radius: 3px;
        background: #0b0b0b;
      }

      .ps-payment-top {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 23px;
      }

      .ps-mpesa-mark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 3px;
        background: #168b4b;
        color: #fff;
        font-size: 25px;
        font-weight: 700;
      }

      .ps-payment-name {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 4px;
      }

      .ps-payment-name strong {
        color: #fff;
        font-size: 13px;
        letter-spacing: 1px;
      }

      .ps-payment-name span {
        color: #858585;
        font-size: 11px;
      }

      .ps-selected-indicator {
        width: 15px;
        height: 15px;
        border: 4px solid #ed202b;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #ed202b;
      }

      .ps-mpesa-field {
        margin-top: 3px;
      }

      .ps-payment-note {
        margin: 15px 0 0;
        color: #858585;
        font-size: 11px;
        line-height: 1.7;
      }

      .ps-form-error {
        margin: 0 0 17px;
        padding: 14px 16px;
        border: 1px solid #76252a;
        background: #241012;
        color: #ff9b9f;
        font-size: 12px;
        line-height: 1.5;
      }

      .ps-submit-button,
      .ps-primary-button {
        width: 100%;
        min-height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 13px;
        padding: 15px 20px;
        border: 0;
        border-radius: 2px;
        background: #ed202b;
        color: #fff;
        cursor: pointer;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 17px;
        letter-spacing: 1px;
        text-align: center;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease;
      }

      .ps-submit-button:hover:not(:disabled),
      .ps-primary-button:hover {
        transform: translateY(-2px);
        background: #c91620;
      }

      .ps-submit-button:disabled {
        cursor: wait;
        opacity: 0.65;
      }

      .ps-checkout-assurance {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 17px;
        color: #777;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.2px;
      }

      .ps-checkout-assurance svg {
        color: #ed202b;
      }

      .ps-order-panel {
        position: sticky;
        top: 25px;
        min-width: 0;
        padding: 27px;
        border: 1px solid #303030;
        border-radius: 4px;
        background: #111;
      }

      .ps-order-panel-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 22px;
        border-bottom: 1px solid #2b2b2b;
      }

      .ps-order-panel-heading h2 {
        margin: 6px 0 0;
        color: #fff;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 27px;
        font-weight: 400;
      }

      .ps-item-count {
        padding: 6px 9px;
        border: 1px solid #383838;
        color: #aaa;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .ps-order-items {
        display: flex;
        flex-direction: column;
      }

      .ps-order-item {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr) auto;
        align-items: start;
        gap: 13px;
        padding: 19px 0;
        border-bottom: 1px solid #292929;
      }

      .ps-item-image {
        width: 72px;
        height: 88px;
        overflow: hidden;
        background: #202020;
      }

      .ps-item-image img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .ps-item-info {
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .ps-item-info > strong {
        color: #f4f1ed;
        font-size: 12px;
        line-height: 1.4;
      }

      .ps-item-info > span {
        color: #858585;
        font-size: 10px;
      }

      .ps-quantity-control {
        height: 27px;
        display: flex;
        align-items: center;
        gap: 11px;
        margin-top: 4px;
        border: 1px solid #383838;
      }

      .ps-quantity-control button {
        width: 25px;
        height: 25px;
        display: grid;
        place-items: center;
        border: 0;
        background: transparent;
        color: #ddd;
        cursor: pointer;
      }

      .ps-quantity-control button:disabled {
        cursor: not-allowed;
        opacity: 0.35;
      }

      .ps-quantity-control span {
        color: #fff;
        font-size: 10px;
      }

      .ps-item-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
      }

      .ps-remove-item {
        padding: 0;
        border: 0;
        background: none;
        color: #858585;
        cursor: pointer;
        font-size: 8px;
        letter-spacing: 1px;
      }

      .ps-remove-item:hover {
        color: #ed202b;
      }

      .ps-order-calculations {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 22px 0;
        border-bottom: 1px solid #2b2b2b;
      }

      .ps-order-calculations > div,
      .ps-order-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .ps-order-calculations span,
      .ps-order-total > span {
        color: #a0a0a0;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .ps-order-calculations strong {
        color: #eee;
        font-size: 12px;
      }

      .ps-order-calculations .ps-delivery-pending {
        color: #ed202b;
        font-size: 9px;
        letter-spacing: 0.5px;
      }

      .ps-order-total {
        padding: 21px 0 12px;
      }

      .ps-order-total > span {
        color: #fff;
      }

      .ps-order-total > strong {
        color: #fff;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 27px;
        font-weight: 400;
      }

      .ps-delivery-disclaimer {
        margin: 0;
        color: #858585;
        font-size: 10px;
        line-height: 1.7;
      }

      .ps-order-promise {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-top: 24px;
        padding: 15px;
        border: 1px solid #2c2c2c;
        background: #0c0c0c;
      }

      .ps-order-promise > svg {
        flex: 0 0 auto;
        color: #ed202b;
      }

      .ps-order-promise div {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .ps-order-promise strong {
        color: #eee;
        font-size: 9px;
        letter-spacing: 0.8px;
      }

      .ps-order-promise span {
        color: #858585;
        font-size: 10px;
        line-height: 1.5;
      }

      .ps-order-secure {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 20px;
        color: #777;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .ps-order-secure svg {
        color: #ed202b;
      }

      .ps-checkout-footer {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 60px;
        padding-top: 20px;
        border-top: 1px solid #292929;
        color: #777;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.3px;
      }

      .ps-success-wrap,
      .ps-empty-checkout {
        width: min(580px, 88%);
        margin: 90px auto;
        padding: 48px;
        border: 1px solid #303030;
        background: #111;
        text-align: center;
      }

      .ps-success-icon,
      .ps-empty-icon {
        width: 70px;
        height: 70px;
        display: grid;
        place-items: center;
        margin: 0 auto 28px;
        border: 1px solid #ed202b;
        border-radius: 50%;
        color: #ed202b;
      }

      .ps-success-wrap h1,
      .ps-empty-checkout h1 {
        margin-top: 13px;
        font-size: clamp(36px, 6vw, 55px);
        line-height: 1.05;
      }

      .ps-success-copy,
      .ps-empty-checkout > p {
        margin: 17px auto 28px;
        color: #999;
        font-size: 13px;
        line-height: 1.8;
      }

      .ps-order-reference {
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin: 30px 0 18px;
        padding: 20px;
        border: 1px solid #333;
        background: #090909;
      }

      .ps-order-reference span,
      .ps-success-details span {
        color: #858585;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.4px;
      }

      .ps-order-reference strong {
        color: #fff;
        font-size: 18px;
        letter-spacing: 1px;
      }

      .ps-success-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 28px;
        padding: 18px 0;
        border-top: 1px solid #292929;
        border-bottom: 1px solid #292929;
      }

      .ps-success-details > div {
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .ps-success-details strong {
        color: #fff;
        font-size: 12px;
      }

      .ps-success-details .ps-pending {
        color: #ed202b;
        font-size: 10px;
      }

      .ps-success-note {
        margin: 22px 0 0;
        color: #777;
        font-size: 10px;
        letter-spacing: 0.5px;
      }

      .ps-empty-checkout .ps-primary-button,
      .ps-success-wrap .ps-primary-button {
        margin-top: 12px;
      }

      .ps-checkout-loading {
        min-height: 70vh;
        display: grid;
        place-items: center;
        color: #ed202b;
        font-family: var(--font-anton), Impact, sans-serif;
        font-size: 20px;
        letter-spacing: 2px;
      }

      @media (max-width: 900px) {
        .ps-checkout-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 25px;
        }

        .ps-order-panel {
          position: static;
          grid-row: 1;
        }

        .ps-checkout-intro {
          padding-top: 38px;
        }
      }

      @media (max-width: 600px) {
        .ps-checkout-header {
          min-height: 66px;
          padding: 0 6%;
        }

        .ps-checkout-logo {
          font-size: 21px;
        }

        .ps-checkout-secure {
          gap: 6px;
          font-size: 8px;
          letter-spacing: 0.7px;
        }

        .ps-checkout-container {
          width: 90%;
        }

        .ps-checkout-intro {
          padding: 35px 0 25px;
        }

        .ps-back-link {
          margin-bottom: 30px;
        }

        .ps-checkout-intro h1 {
          font-size: 55px;
        }

        .ps-form-section {
          padding: 20px 16px;
        }

        .ps-section-heading {
          gap: 11px;
          margin-bottom: 21px;
        }

        .ps-section-heading h2 {
          font-size: 19px;
        }

        .ps-field-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 17px;
        }

        .ps-field-full {
          grid-column: auto;
        }

        .ps-order-panel {
          padding: 20px 16px;
        }

        .ps-order-item {
          grid-template-columns: 62px minmax(0, 1fr) auto;
          gap: 10px;
        }

        .ps-item-image {
          width: 62px;
          height: 78px;
        }

        .ps-item-price {
          font-size: 10px;
        }

        .ps-checkout-footer {
          margin-top: 40px;
          font-size: 8px;
        }

        .ps-success-wrap,
        .ps-empty-checkout {
          margin: 55px auto;
          padding: 32px 20px;
        }

        .ps-success-details {
          grid-template-columns: 1fr;
          text-align: left;
        }
      }
    `}</style>
  );
}
