import { useEffect, useState } from "react";
import {
  restaurant,
  days,
  prices,
  priceTable,
  formatFt,
} from "./menuData.js";
import Cart from "./Cart.jsx";
import "./shop.css";
const CART_KEY = "steves-cart-v1";
const ORDERS_KEY = "steves-orders-v1";
const EMPTY_CART = { items: [], packaging: false };
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items)
      ? parsed.items.filter(
          (i) =>
            i &&
            typeof i.id === "string" &&
            typeof i.name === "string" &&
            Number.isFinite(i.price) &&
            Number.isInteger(i.qty) &&
            i.qty > 0
        )
      : [];
    return { items, packaging: Boolean(parsed.packaging) };
  } catch {
    return EMPTY_CART;
  }
}

function AddButton({ label, price, onClick }) {
  return (
    <button type="button" className="add-btn" onClick={onClick}>
      <span className="add-label">{label}</span>
      <span className="add-price">{formatFt(price)}</span>
      <span className="add-plus" aria-hidden="true">
        +
      </span>
    </button>
  );
}

function PriceList({ items }) {
  return (
    <ul className="price-list">
      {items.map((p) => (
        <li key={p.label}>
          <span className="price-label">{p.label}:</span>{" "}
          <strong>
            {p.price} {p.suffix ?? "Ft"}
          </strong>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");


  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      
    }
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const addItem = (id, name, price) => {
    setCart((c) => {
      const exists = c.items.find((i) => i.id === id);
      const items = exists
        ? c.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...c.items, { id, name, price, qty: 1 }];
      return { ...c, items };
    });
    setToast("Hozzáadva a kosárhoz ✓");
  };

  const changeQty = (id, delta) =>
    setCart((c) => ({
      ...c,
      items: c.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    }));

  const removeItem = (id) =>
    setCart((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }));

  const setPackaging = (packaging) => setCart((c) => ({ ...c, packaging }));

  const clearCart = () => setCart(EMPTY_CART);

  const placeOrder = (order) => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const orders = raw ? JSON.parse(raw) : [];
      orders.push(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {

    }
    setCart(EMPTY_CART);
  };

  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + (cart.packaging ? count * priceTable.packaging : 0);

  return (
    <div className="page">
      <div className="sheet">
        <header className="header">
          <div className="header-text">
            <h1>{restaurant.name.toUpperCase()}</h1>
            <p className="subtitle">
              {restaurant.title} <span className="dot">•</span>{" "}
              {restaurant.dateRange}
            </p>
          </div>
        </header>

        <div className="gold-line" />

        <div className="table-wrap">
          <table className="menu-table">
            <thead>
              <tr>
                <th>NAP</th>
                <th>LEVES</th>
                <th>“A” MENÜ</th>
                <th>“B” MENÜ</th>
                <th>HETI MENÜ</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.nap}>
                  <td className="day">{d.nap}</td>

                  <td data-label="Leves">
                    <div className="dish">{d.leves}</div>
                    <div className="actions">
                      <AddButton
                        label="Csak leves"
                        price={priceTable.soup}
                        onClick={() =>
                          addItem(
                            `${d.nap}-soup`,
                            `${d.nap}: ${d.leves} (csak leves)`,
                            priceTable.soup
                          )
                        }
                      />
                    </div>
                  </td>

                  <td data-label="“A” menü">
                    <div className="dish">{d.a}</div>
                    <div className="actions">
                      <AddButton
                        label="Főétel"
                        price={priceTable.mainA}
                        onClick={() =>
                          addItem(
                            `${d.nap}-mainA`,
                            `${d.nap}: ${d.a} (A főétel)`,
                            priceTable.mainA
                          )
                        }
                      />
                      <AddButton
                        label="Leves + főétel"
                        price={priceTable.menuA}
                        onClick={() =>
                          addItem(
                            `${d.nap}-menuA`,
                            `${d.nap}: ${d.leves} + ${d.a} (A-menü)`,
                            priceTable.menuA
                          )
                        }
                      />
                    </div>
                  </td>

                  <td data-label="“B” menü">
                    <div className="dish">{d.b}</div>
                    <div className="actions">
                      <AddButton
                        label="Főétel"
                        price={priceTable.mainB}
                        onClick={() =>
                          addItem(
                            `${d.nap}-mainB`,
                            `${d.nap}: ${d.b} (B főétel)`,
                            priceTable.mainB
                          )
                        }
                      />
                      <AddButton
                        label="Leves + főétel"
                        price={priceTable.menuB}
                        onClick={() =>
                          addItem(
                            `${d.nap}-menuB`,
                            `${d.nap}: ${d.leves} + ${d.b} (B-menü)`,
                            priceTable.menuB
                          )
                        }
                      />
                    </div>
                  </td>

                  <td data-label="Heti menü">
                    <div className="dish">{d.heti}</div>
                    <div className="actions">
                      <AddButton
                        label="Főétel"
                        price={priceTable.mainHeti}
                        onClick={() =>
                          addItem(
                            `${d.nap}-mainHeti`,
                            `${d.nap}: ${d.heti} (heti főétel)`,
                            priceTable.mainHeti
                          )
                        }
                      />
                      <AddButton
                        label="Leves + főétel"
                        price={priceTable.menuHeti}
                        onClick={() =>
                          addItem(
                            `${d.nap}-menuHeti`,
                            `${d.nap}: ${d.leves} + ${d.heti} (heti menü)`,
                            priceTable.menuHeti
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="section-title">ÁRAK (FT)</h2>
        <div className="gold-line thin" />
        <div className="prices">
          <PriceList items={prices.left} />
          <PriceList items={prices.right} />
        </div>

        <div className="extras">
          <span className="extras-title">Extra:</span>
          <AddButton
            label="Savanyúság"
            price={priceTable.pickle}
            onClick={() =>
              addItem("extra-pickle", "Savanyúság", priceTable.pickle)
            }
          />
          <span className="extras-note">
            A csomagolás ({formatFt(priceTable.packaging)}/db) a kosárban
            kérhető.
          </span>
        </div>
        <h2 className="section-title">RENDELÉSI &amp; ÁTVÉTELI INFORMÁCIÓK</h2>
        <div className="gold-line thin" />
        <div className="order-box">
          <p>
            <strong>Rendelés leadás:</strong> {restaurant.orderFrom} a{" "}
            <a href={`tel:${restaurant.orderPhone.replace(/\s/g, "")}`}>
              <strong>{restaurant.orderPhone}</strong>
            </a>{" "}
            as számon.
          </p>
          <p>
            <strong>Elvitel és átvétel:</strong> {restaurant.pickupFrom}.
          </p>
          <p>
            <strong>Cím:</strong> {restaurant.address}
          </p>
        </div>

        <footer className="greeting">
          <span className="swoosh" />
          <em>{restaurant.greeting}</em>
          <span className="swoosh flip" />
        </footer>
      </div>
      <button
        type="button"
        className="cart-fab"
        onClick={() => setOpen(true)}
        aria-label={`Kosár megnyitása, ${count} tétel`}
      >
        <span className="cart-fab-icon">🛒</span>
        <span className="cart-fab-text">
          {count > 0 ? formatFt(total) : "Kosár"}
        </span>
        {count > 0 && <span className="cart-fab-badge">{count}</span>}
      </button>

      {toast && <div className="toast">{toast}</div>}

      {open && (
        <Cart
          items={cart.items}
          packaging={cart.packaging}
          onPackaging={setPackaging}
          onQty={changeQty}
          onRemove={removeItem}
          onClear={clearCart}
          onPlaceOrder={placeOrder}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
