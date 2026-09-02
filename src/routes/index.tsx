import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  perfumes,
  featuredPerfume,
  type Perfume,
} from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Avéline — Luxury Fragrance Atelier",
        description:
          "A small house of slow-made eaux de parfum. Discover Véla Nocturne and the collection — amber woods, damask rose, wild incense.",
      },
      { property: "og:title", content: "Avéline — Luxury Fragrance Atelier" },
      {
        property: "og:description",
        content:
          "A small house of slow-made eaux de parfum. Discover Véla Nocturne and the collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
],
  }),
  component: Index,
});

interface CartLine {
  perfume: Perfume;
  qty: number;
}

function Index() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewing, setViewing] = useState<Perfume | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.qty * line.perfume.price, 0);

  const addToCart = (perfume: Perfume, qty: number) => {
    setCart((prev) => {
      const existing = cart.find((line) => line.perfume.id === perfume.id);
      if (existing) {
        return cart.map((line) =>
          line.perfume.id === perfume.id
            ? { ...line, qty: line.qty + qty }
            : line,
        );
      }
      return [...cart, { perfume, qty }];
    });
    setCartOpen(true);
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.perfume.id === id ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  };

  const openDetails = (perfume: Perfume) => {
    setDetailQty(1);
    setViewing(perfume);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* ambient frozen lights */}
      <div className="aurora fixed inset-0 -z-10" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div
          className="ambient-one absolute -left-20 -top-16 size-72 rounded-full blur-lg"

        />
        <div
          className="ambient-two absolute -right-24 top-40 size-72 rounded-full blur-lg"

        />
        <div
          className="ambient-three absolute bottom-10 left-1/3 size-64 rounded-full blur-xl"

        />
      </div>

      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main className="mx-auto max-w-md px-3 pb-40">
        <Hero perfume={featuredPerfume} onAdd={() => addToCart(featuredPerfume, 1)} />

        <Collection
          perfumes={perfumes}
          onSelect={openDetails}
          onQuickAdd={(p) => addToCart(p, 1)}
        />
      </main>

      {viewing && (
        <PerfumeModal
          perfume={viewing}
          qty={detailQty}
          onQtyChange={setDetailQty}
          onClose={() => setViewing(null)}
          onAdd={() => {
            addToCart(viewing, detailQty);
            setViewing(null);
          }}
        />
      )}

      <CartDrawer
        open={cartOpen}
        cart={cart}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
      />
    </div>
  );
}

function Header({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass mx-auto flex max-w-[calc(28rem+1.5rem)] items-center justify-between rounded-2xl border border-border px-4 py-3 shadow-[0_8px_30px_rgba(66,86,138,0.12)]">
        <div className="leading-none">
          <p className="font-display text-[22px] tracking-[0.18em] text-branddeep">
            AVÉLINE
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.42em] text-branddeep/55">
            Fragrance Atelier
          </p>
        </div>
        <button
          onClick={onCartOpen}
          className="glass relative grid size-11 place-items-center rounded-full border border-border shadow-[0_4px_16px_rgba(66,86,138,0.14)]"
          aria-label="Open cart"
        >
          <span className="text-lg" aria-hidden="true">
            ♛
          </span>
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-medium text-primary-foreground">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Hero({
  perfume,
  onAdd,
}: {
  perfume: Perfume;
  onAdd: () => void;
}) {
  return (
    <section className="glass relative mt-4 overflow-hidden rounded-3xl border border-border p-5 shadow-glass">
      <div
        className="ambient-gold absolute -right-8 -top-8 size-32 rounded-full"

        aria-hidden="true"
      />
      <div className="flex items-center gap-4">
        <img
          src={perfume.image}
          alt={`${perfume.name} ${perfume.italicName ?? ""} flacon`}
          width={1024}
          height={1024}
          className="size-28 shrink-0 rounded-2xl object-cover shadow-card"
        />
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-gold">
            {perfume.number} — {perfume.family}
          </p>
          <h1 className="mt-2 font-display text-[40px] leading-[0.92] text-ink">
            {perfume.name}
            <br />
            <span className="italic text-branddeep">
              {perfume.italicName ?? "Avéline"}
            </span>
          </h1>
          <p className="mt-3 text-[12px] leading-relaxed text-ink/60">
            {perfume.description}
          </p>
          <p className="mt-3 font-display text-[20px] text-branddeep">
            ${perfume.price}
          </p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="mt-5 h-12 w-full rounded-full bg-branddeep text-[13px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta transition-transform duration-300 hover:-translate-y-0.5"
      >
        Add to Cart
      </button>
    </section>
  );
}

function Collection({
  perfumes,
  selectedId,
  onSelect,
  onQuickAdd,
}: {
  perfumes: Perfume[];
  selectedId: string;
  onSelect: (p: Perfume) => void;
  onQuickAdd: (p: Perfume) => void;
}) {
  return (
    <section>
      <div className="mt-8 flex items-end justify-between">
        <h2 className="font-display text-[26px] text-ink">The Collection</h2>
        <span className="text-[11px] uppercase tracking-[0.28em] text-branddeep/50">
          {String(perfumes.length).padStart(2, "0")} pieces
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {perfumes.map((p) => (
          <article
            key={p.id}
            className="glass rounded-2xl border border-border p-3 shadow-card transition-transform duration-300 hover:-translate-y-1"
          >
            <button
              onClick={() => onSelect(p)}
              className="block w-full text-left"
              aria-label={`View ${p.name}`}
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <img
                  src={p.image}
                  alt={`${p.name} flacon`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className={`h-full w-full object-cover transition-transform duration-500 hover:scale-105 ${
                    p.id === selectedId ? "ring-2 ring-gold" : ""
                  }`}
                />
              </div>
              <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-gold">
                {p.number}
              </p>
              <h3 className="font-display text-[19px] leading-tight text-ink">
                {p.name} {p.italicName && <span className="italic">{p.italicName}</span>}
              </h3>
              <p className="mt-0.5 text-[11px] text-ink/55">{p.notes}</p>
            </button>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] text-branddeep">${p.price}</span>
              <button
                onClick={() => onQuickAdd(p)}
                className="grid size-9 place-items-center rounded-full bg-branddeep text-lg text-primary-foreground shadow-[0_6px_16px_rgba(66,86,138,0.3)] transition-transform hover:scale-105"
                aria-label={`Add ${p.name} to cart`}
              >
                +
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({
  perfume,
  qty,
  onQtyChange,
  onAdd,
}: {
  perfume: Perfume;
  qty: number;
  onQtyChange: (qty: number) => void;
  onAdd: () => void;
}) {
  return (
    <section
      id="detail"
      className="glass mt-8 rounded-3xl border border-border p-5 shadow-glass"
    >
      <div className="flex gap-4">
        <img
          src={perfume.image}
          alt={`${perfume.name} bottle detail`}
          loading="lazy"
          width={1024}
          height={1024}
          className="size-24 shrink-0 rounded-2xl object-cover shadow-card"
        />
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
            Now viewing
          </p>
          <h3 className="font-display text-[24px] leading-tight text-ink">
            {perfume.name} {perfume.italicName && <span className="italic">{perfume.italicName}</span>}
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-ink/60">
            {perfume.notes}. {perfume.size}.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {perfume.noteTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-[11px] tracking-wide text-branddeep"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="glass flex items-center rounded-full border border-border px-1 py-1">
          <button
            onClick={() => onQtyChange(Math.max(1, qty - 1))}
            className="grid size-9 place-items-center rounded-full text-lg text-branddeep"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            onClick={() => onQtyChange(Math.min(9, qty + 1))}
            className="grid size-9 place-items-center rounded-full text-lg text-branddeep"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={onAdd}
          className="h-12 flex-1 rounded-full bg-branddeep text-[13px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta transition-transform duration-300 hover:-translate-y-0.5"
        >
          Add to Cart — ${perfume.price * qty}
        </button>
      </div>
    </section>
  );
}

function CartDrawer({
  open,
  cart,
  subtotal,
  onClose,
  onChangeQty,
}: {
  open: boolean;
  cart: CartLine[];
  subtotal: number;
  onClose: () => void;
  onChangeQty: (id: string, delta: number) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 transition-transform duration-500 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="glass mx-auto max-w-md rounded-t-3xl border border-border p-4 shadow-[0_-14px_44px_rgba(66,86,138,0.22)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-branddeep/60">
              Your Cart · {cart.reduce((sum, line) => sum + line.qty, 0)}
            </p>
            <button
              onClick={onClose}
              className="text-[11px] uppercase tracking-[0.2em] text-branddeep"
              aria-label="Close cart"
            >
              Close
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/50">
              Your cart is empty — the collection awaits.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {cart.map((line) => (
                <div key={line.perfume.id} className="flex items-center gap-3">
                  <img
                    src={line.perfume.image}
                    alt={line.perfume.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1 leading-tight">
                    <p className="font-display text-[16px] text-ink">
                      {line.perfume.name}
                    </p>
                    <p className="text-[11px] text-ink/50">
                      Qty {line.qty} · {line.perfume.family}
                    </p>
                  </div>
                  <div className="glass flex items-center gap-1 rounded-full px-1">
                    <button
                      onClick={() => onChangeQty(line.perfume.id, -1)}
                      className="grid size-7 place-items-center rounded-full text-branddeep"
                      aria-label={`Decrease ${line.perfume.name}`}
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-xs">{line.qty}</span>
                    <button
                      onClick={() => onChangeQty(line.perfume.id, 1)}
                      className="grid size-7 place-items-center rounded-full text-branddeep"
                      aria-label={`Increase ${line.perfume.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="w-12 text-right text-[13px] text-branddeep">
                    ${line.perfume.price * line.qty}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-[12px] uppercase tracking-[0.2em] text-ink/60">
                  Subtotal
                </span>
                <span className="font-display text-[22px] text-ink">
                  ${subtotal}
                </span>
              </div>
              <button className="h-12 w-full rounded-full bg-branddeep text-[13px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta">
                Checkout
              </button>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-ink/40">
                Visual storefront — no real checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
