
import Link from "next/link";
import ShopCatalog from "@/components/products/ShopCatalog";
import { products } from "@/lib/products";

export const metadata = {
  title: "Shop | Prolific Szn",
  description:
    "Explore the Prolific Szn collection. Independent streetwear for those who refuse to fit the norm.",
};

export default function ShopPage() {
  return (
    <main className="shop-page">
      <header className="shop-header">
        <Link href="/" className="brand-logo">
          PROLIFIC<span>.</span>
        </Link>

        <nav className="shop-nav">
          <Link href="/">Home</Link>
          <Link href="/shop" className="active">Shop</Link>
          <Link href="/#manifesto">Our Story</Link>
        </nav>

        <Link href="/cart" className="shop-cart">
          BAG <span>↗</span>
        </Link>
      </header>

      <section className="shop-hero">
        <div className="shop-hero-content">
          <p className="eyebrow">THE PROLIFIC COLLECTION · 001</p>

          <h1>
            THE
            <span>COLLECTION.</span>
          </h1>

          <p>
            Pieces for the bold. Essentials for the different.
            Discover your next statement.
          </p>
        </div>

        <div className="shop-hero-index">
          INDEPENDENT STREETWEAR / NAIROBI, KE
        </div>
      </section>

      <section className="shop-content container">
        <div className="shop-intro">
          <div>
            <p className="eyebrow">EXPLORE THE COLLECTION</p>
            <h2 className="section-title">FIND YOUR PIECE.</h2>
          </div>

          <p>
            No uniforms. No limitations. Just pieces that let you
            express exactly who you are.
          </p>
        </div>

        <ShopCatalog products={products} />
      </section>

      <footer className="shop-footer">
        <Link href="/" className="brand-logo">
          PROLIFIC<span>.</span>
        </Link>

        <p>DARE TO BE GREAT. © 2026 PROLIFIC SZN.</p>
      </footer>
    </main>
  );
}
