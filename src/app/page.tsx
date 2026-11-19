import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

const products = [
  {
    name: "The Outcast Tee",
    category: "Graphic Essentials",
    price: "KSh 2,500",
    tag: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Szn Oversized Fit",
    category: "Everyday Uniform",
    price: "KSh 3,200",
    tag: "NEW DROP",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "After Hours Hoodie",
    category: "Outerwear",
    price: "KSh 4,500",
    tag: "LIMITED",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Home() {
  return (
    <main>
      {/* NAVIGATION */}
      <header className="site-header">
        <a href="/" className="brand-logo">
          PROLIFIC SZN<span>.</span>
        </a>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="#shop">Shop</a>
          <a href="#manifesto">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <a href="#shop">Explore</a>
          <a href="/cart" aria-label="Shopping cart">
            <ShoppingBag size={19} />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-image" />

        <div className="hero-content">
          <div className="eyebrow hero-kicker">
            Independent streetwear · Nairobi, Kenya
          </div>

          <h1 className="hero-title">
            DARE
            <span>TO BE GREAT.</span>
          </h1>

          <p className="hero-description">
            Made for the ones who never needed
            permission to be different. This is Prolific Szn.
          </p>

          <a href="#shop" className="primary-button">
            Discover the collection
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="hero-index">
          EST. INDEPENDENT. ALWAYS DIFFERENT. — 001
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="marquee" aria-label="Brand statement">
        <div className="marquee-track">
          <span>PROLIFIC SZN</span> — NO RULES. NO LIMITS. —
          <span>DARE TO BE GREAT.</span> — BUILT DIFFERENT. —
          <span>PROLIFIC SZN</span> — NO RULES. NO LIMITS. —
          <span>REFUSE TO FIT IN.</span> — BUILT DIFFERENT. —
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="section container" id="shop">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Curated for the different</div>
            <h2 className="section-title">THE LATEST DROP.</h2>
          </div>

          <a href="/shop" className="text-link">
            View all pieces <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <a href="/shop" aria-label={`Explore ${product.name}`}>
                <div
                  className="product-image"
                  style={{ backgroundImage: `url("${product.image}")` }}
                >
                  <span className="product-tag">{product.tag}</span>
                </div>

                <div className="product-info">
                  <div>
                    <div className="product-name">{product.name}</div>
                    <div
                      style={{
                        color: "#999590",
                        fontSize: "11px",
                        marginTop: "5px",
                      }}
                    >
                      {product.category}
                    </div>
                  </div>

                  <div className="product-price">{product.price}</div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* BRAND MANIFESTO */}
      <section className="manifesto" id="manifesto">
        <div className="container">
          <div className="manifesto-content">
            <div className="eyebrow">This is more than clothing</div>

            <h2 className="manifesto-title">
              BORN TO
              <br />
              <span>STAND OUT.</span>
            </h2>

            <p>
              We don't follow the culture. We create our own. Prolific Szn
              exists for the bold, the unapologetic and everyone who refuses
              to be another face in the crowd.
            </p>

            <a href="/about" className="primary-button">
              Discover our story <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-top">
            <div>
              <a href="/" className="brand-logo">
                PROLIFIC<span>.</span>
              </a>

              <p className="footer-copy">
                Independent by nature. Different by design. For those who
                refuse to fit in.
              </p>
            </div>

            <div>
              <div className="eyebrow">Explore</div>
              <p><a href="/shop">Shop all</a></p>
              <p><a href="/about">Our story</a></p>
              <p><a href="#contact">Contact</a></p>
            </div>

            <div>
              <div className="eyebrow">Stay connected</div>
              <p><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a></p>
              <p><a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok ↗</a></p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Prolific Szn. All rights reserved.</span>
            <span>Made for the different.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}