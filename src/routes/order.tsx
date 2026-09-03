import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      {
        title: "Your Order — Avéline",
        description:
          "Review your Avéline order, add gift packaging, and confirm delivery details.",
      },
      { property: "og:title", content: "Your Order — Avéline" },
      {
        property: "og:description",
        content:
          "Review your Avéline order, add gift packaging, and confirm delivery details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

const GIFT_BOX_PRICE = 12;

function OrderPage() {
  const { cart, subtotal, changeQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [giftBox, setGiftBox] = useState(false);
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [placed, setPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const total = subtotal + (giftBox ? GIFT_BOX_PRICE : 0);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNo = `AV-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlaced(orderNo);
    clearCart();
  };

  if (placed) {
    return (
      <div className="relative min-h-screen overflow-x-clip">
        <div className="aurora fixed inset-0 -z-10" aria-hidden="true" />
        <OrderHeader />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 pb-32 pt-24 text-center sm:max-w-xl">
          <div className="glass grid size-16 place-items-center rounded-full border border-border text-2xl text-gold shadow-card">
            ✓
          </div>
          <h1 className="mt-6 font-display text-[38px] leading-none text-ink">
            Merci, your order is placed
          </h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.3em] text-branddeep/60">
            Order {placed}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
            Our atelier will prepare your flacons with care. We will call to
            confirm delivery shortly.
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-8 h-12 rounded-full bg-branddeep px-10 text-[13px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta transition-transform duration-300 hover:-translate-y-0.5"
          >
            Continue Browsing
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="aurora fixed inset-0 -z-10" aria-hidden="true" />
      <OrderHeader />

      <main className="mx-auto max-w-md px-3 pb-40 sm:max-w-3xl sm:px-6 lg:max-w-5xl">
        <h1 className="mt-6 font-display text-[32px] text-ink sm:text-[42px]">
          Your Order
        </h1>

        {cart.length === 0 ? (
          <div className="glass mt-6 rounded-2xl border border-border p-10 text-center shadow-card">
            <p className="text-sm text-ink/55">
              Your order is empty — the collection awaits.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-branddeep px-8 text-[12px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta"
            >
              Back to the Collection
            </Link>
          </div>
        ) : (
          <form
            onSubmit={placeOrder}
            className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start"
          >
            {/* Left — details */}
            <div className="space-y-5">
              {/* Items */}
              <section className="glass rounded-2xl border border-border p-4 shadow-card sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-branddeep/60">
                  Items · {cart.reduce((s, l) => s + l.qty, 0)}
                </p>
                <div className="mt-3 space-y-3">
                  {cart.map((line) => (
                    <div key={line.perfume.id} className="flex items-center gap-3">
                      <img
                        src={line.perfume.image}
                        alt={line.perfume.name}
                        loading="lazy"
                        width={512}
                        height={512}
                        className="size-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex-1 leading-tight">
                        <p className="font-display text-[17px] text-ink">
                          {line.perfume.name}{" "}
                          {line.perfume.italicName && (
                            <span className="italic">{line.perfume.italicName}</span>
                          )}
                        </p>
                        <p className="text-[11px] text-ink/50">
                          {line.perfume.number} · {line.perfume.family}
                        </p>
                      </div>
                      <div className="glass flex items-center gap-1 rounded-full px-1">
                        <button
                          type="button"
                          onClick={() => changeQty(line.perfume.id, -1)}
                          className="grid size-7 place-items-center rounded-full text-branddeep"
                          aria-label={`Decrease ${line.perfume.name}`}
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(line.perfume.id, 1)}
                          className="grid size-7 place-items-center rounded-full text-branddeep"
                          aria-label={`Increase ${line.perfume.name}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="w-14 text-right text-[13px] text-branddeep">
                        ${line.perfume.price * line.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gift box upsell — inspired by reference */}
              <section className="glass overflow-hidden rounded-2xl border border-border shadow-card">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-36 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44">
                    <div className="ambient-gold absolute inset-0" />
                    <div className="absolute inset-0 grid place-items-center bg-branddeep/90">
                      <div className="text-center">
                        <p className="font-display text-[18px] tracking-[0.18em] text-primary-foreground">
                          AVÉLINE
                        </p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-primary-foreground/60">
                          Coffret Cadeau
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-gold">
                      An experience worth gifting
                    </p>
                    <h3 className="mt-1 font-display text-[22px] text-ink">
                      Signature Gift Box
                    </h3>
                    <p className="text-[13px] text-branddeep">
                      ${GIFT_BOX_PRICE}.00
                    </p>
                    <button
                      type="button"
                      onClick={() => setGiftBox((v) => !v)}
                      className={`mt-3 h-10 w-fit rounded-full px-6 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                        giftBox
                          ? "bg-gold text-primary-foreground shadow-cta"
                          : "border border-border bg-card/50 text-branddeep"
                      }`}
                    >
                      {giftBox ? "Added ✓" : "Upgrade to Gift Packaging"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Delivery details */}
              <section className="glass rounded-2xl border border-border p-4 shadow-card sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-branddeep/60">
                  Delivery Details
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Full Name" required>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Aisha Rasheed"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+960 777 0000"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Email" className="sm:col-span-2">
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Address" required className="sm:col-span-2">
                    <input
                      required
                      value={form.address}
                      onChange={set("address")}
                      placeholder="Street, house, apartment"
                      className="field-input"
                    />
                  </Field>
                  <Field label="City / Island" required>
                    <input
                      required
                      value={form.city}
                      onChange={set("city")}
                      placeholder="Malé"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Delivery Notes">
                    <input
                      value={form.notes}
                      onChange={set("notes")}
                      placeholder="Optional"
                      className="field-input"
                    />
                  </Field>
                </div>
              </section>

              {/* Payment */}
              <section className="glass rounded-2xl border border-border p-4 shadow-card sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-branddeep/60">
                  Payment Method
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["cod", "Cash on Delivery", "Pay when your order arrives"],
                      ["card", "Card on Delivery", "Pay by card at your door"],
                    ] as const
                  ).map(([value, label, hint]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPayment(value)}
                      className={`rounded-xl border p-3 text-left transition-all duration-300 ${
                        payment === value
                          ? "border-gold bg-card/70 shadow-card"
                          : "border-border bg-card/40"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-[13px] text-ink">
                        <span
                          className={`grid size-4 place-items-center rounded-full border ${
                            payment === value
                              ? "border-gold bg-gold text-[9px] text-primary-foreground"
                              : "border-branddeep/30"
                          }`}
                        >
                          {payment === value && "✓"}
                        </span>
                        {label}
                      </p>
                      <p className="mt-1 text-[11px] text-ink/50">{hint}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Right — summary */}
            <aside className="glass rounded-2xl border border-border p-5 shadow-card lg:sticky lg:top-24">
              <p className="text-[11px] uppercase tracking-[0.3em] text-branddeep/60">
                Order Summary
              </p>
              <div className="mt-4 space-y-2 text-[13px] text-ink/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {giftBox && (
                  <div className="flex justify-between text-gold">
                    <span>Gift packaging</span>
                    <span>${GIFT_BOX_PRICE}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-branddeep">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-ink/60">
                    Total
                  </span>
                  <span className="font-display text-[26px] text-ink">
                    ${total}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="mt-5 h-12 w-full rounded-full bg-branddeep text-[13px] uppercase tracking-[0.2em] text-primary-foreground shadow-cta transition-transform duration-300 hover:-translate-y-0.5"
              >
                Place Order — ${total}
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-ink/40">
                Visual storefront — no real payment
              </p>
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}

function OrderHeader() {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass mx-auto flex max-w-[calc(28rem+1.5rem)] items-center justify-between rounded-2xl border border-border px-4 py-3 shadow-[0_8px_30px_rgba(66,86,138,0.12)] sm:max-w-[calc(48rem+3rem)] sm:px-6 lg:max-w-[calc(64rem+3rem)]">
        <Link to="/" className="leading-none" aria-label="Back to Avéline home">
          <p className="font-display text-[22px] tracking-[0.18em] text-branddeep">
            AVÉLINE
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.42em] text-branddeep/55">
            Fragrance Atelier
          </p>
        </Link>
        <Link
          to="/"
          className="text-[11px] uppercase tracking-[0.24em] text-branddeep"
        >
          ← Collection
        </Link>
      </div>
    </header>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-ink/55">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}
