import { useState } from "react";
import { formatFt, priceTable, restaurant } from "./menuData.js";
export default function Cart({
  items, packaging, onPackaging, onQty, onRemove, onClear, onPlaceOrder, onClose,
}) {
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    time: "11:30",
    payment: "cash",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const packagingFee = packaging ? count * priceTable.packaging : 0;
  const total = subtotal + packagingFee;
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = "Kérjük, add meg a neved.";
    if (!/^[+\d][\d\s/-]{7,}$/.test(form.phone.trim()))
      err.phone = "Kérjük, adj meg érvényes telefonszámot.";
    if (!form.time || form.time < "11:00")
      err.time = "Átvétel 11:00 órától lehetséges.";
    return err;
  };
  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0 || items.length === 0) return;
    const placed = {
      id: "SK-" + Date.now().toString(36).toUpperCase().slice(-5),
      createdAt: new Date().toISOString(),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
      },
      pickupTime: form.time,
      payment: form.payment,
      note: form.note.trim(),
      items,
      packaging,
      packagingFee,
      subtotal,
      total,
    };
    onPlaceOrder(placed);
    setOrder(placed);
    setStep("done");
  };

  return (
    <div className="overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Kosár"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2>
            {step === "cart" && "Kosár"}
            {step === "checkout" && "Pénztár"}
            {step === "done" && "Köszönjük!"}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Bezárás"
          >
            ✕
          </button>
        </div>
        {step === "cart" && (
          <>
            <div className="drawer-body">
              {items.length === 0 ? (
                <p className="empty">A kosár üres. Válassz a menüből! 🍽️</p>
              ) : (
                <ul className="cart-list">
                  {items.map((i) => (
                    <li key={i.id} className="cart-item">
                      <div className="cart-item-name">{i.name}</div>
                      <div className="cart-item-row">
                        <div className="qty">
                          <button
                            type="button"
                            onClick={() => onQty(i.id, -1)}
                            aria-label="Kevesebb"
                          >
                            −
                          </button>
                          <span>{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => onQty(i.id, 1)}
                            aria-label="Több"
                          >
                            +
                          </button>
                        </div>
                        <strong>{formatFt(i.price * i.qty)}</strong>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => onRemove(i.id)}
                        >
                          Törlés
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {items.length > 0 && (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={packaging}
                    onChange={(e) => onPackaging(e.target.checked)}
                  />
                  Csomagolás kérése (+{formatFt(priceTable.packaging)}/db)
                </label>
              )}
            </div>

            <div className="drawer-foot">
              {items.length > 0 && (
                <>
                  <div className="sum-row">
                    <span>Részösszeg</span>
                    <span>{formatFt(subtotal)}</span>
                  </div>
                  {packaging && (
                    <div className="sum-row">
                      <span>
                        Csomagolás ({count} × {priceTable.packaging} Ft)
                      </span>
                      <span>{formatFt(packagingFee)}</span>
                    </div>
                  )}
                  <div className="sum-row total">
                    <span>Összesen</span>
                    <span>{formatFt(total)}</span>
                  </div>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setStep("checkout")}
                  >
                    Tovább a pénztárhoz
                  </button>
                  <button
                    type="button"
                    className="link-btn center"
                    onClick={onClear}
                  >
                    Kosár ürítése
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {step === "checkout" && (
          <form className="checkout" onSubmit={submit} noValidate>
            <div className="drawer-body">
              <label className="field">
                Név
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  autoComplete="name"
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </label>

              <label className="field">
                Telefonszám
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="06 70 123 4567"
                  autoComplete="tel"
                />
                {errors.phone && <span className="err">{errors.phone}</span>}
              </label>

              <label className="field">
                Átvétel ideje (11:00-tól)
                <input
                  type="time"
                  min="11:00"
                  value={form.time}
                  onChange={setField("time")}
                />
                {errors.time && <span className="err">{errors.time}</span>}
              </label>

              <fieldset className="field">
                <legend>Fizetés átvételkor</legend>
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.payment === "cash"}
                    onChange={setField("payment")}
                  />
                  Készpénz
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={form.payment === "card"}
                    onChange={setField("payment")}
                  />
                  Bankkártya
                </label>
              </fieldset>

              <label className="field">
                Megjegyzés (opcionális)
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={setField("note")}
                />
              </label>

              <p className="small">
                Átvétel: {restaurant.address}
              </p>
            </div>

            <div className="drawer-foot">
              <div className="sum-row total">
                <span>Fizetendő ({count} tétel)</span>
                <span>{formatFt(total)}</span>
              </div>
              <button type="submit" className="primary-btn">
                Megrendelem
              </button>
              <button
                type="button"
                className="link-btn center"
                onClick={() => setStep("cart")}
              >
                ← Vissza a kosárhoz
              </button>
            </div>
          </form>
        )}

        {step === "done" && order && (
          <>
            <div className="drawer-body">
              <div className="done-box">
                <div className="done-icon">✅</div>
                <p>
                  A rendelésed rögzítettük.
                  <br />
                  Rendelésszám: <strong>{order.id}</strong>
                </p>
              </div>

              <ul className="cart-list compact">
                {order.items.map((i) => (
                  <li key={i.id} className="cart-item">
                    <div className="cart-item-name">
                      {i.qty} × {i.name}
                    </div>
                    <strong>{formatFt(i.price * i.qty)}</strong>
                  </li>
                ))}
              </ul>

              {order.packaging && (
                <div className="sum-row">
                  <span>Csomagolás</span>
                  <span>{formatFt(order.packagingFee)}</span>
                </div>
              )}
              <div className="sum-row total">
                <span>Összesen</span>
                <span>{formatFt(order.total)}</span>
              </div>

              <p className="small">
                Átvétel: {order.pickupTime}, {restaurant.address}
                <br />
                Fizetés: {order.payment === "cash" ? "készpénz" : "bankkártya"}{" "}
                átvételkor.
                <br />
                Kérdés esetén hívj:{" "}
                <a href={`tel:${restaurant.orderPhone.replace(/\s/g, "")}`}>
                  {restaurant.orderPhone}
                </a>
              </p>
            </div>
            <div className="drawer-foot">
              <button type="button" className="primary-btn" onClick={onClose}>
                Bezárás
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
