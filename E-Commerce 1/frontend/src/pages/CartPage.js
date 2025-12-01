import React from 'react';
import { useCart } from '../context/CartContext';
import './Pages.css';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="container page cart-page">
      <h2>Your cart is empty</h2>
      <p>Browse products and add them to your cart.</p>
    </div>
  );

  return (
    <div className="container page cart-page">
      <h2>Your Cart</h2>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <div className="cart-item-controls">
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item._id, parseInt(e.target.value || 1))} />
                  <button className="btn-outline" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
              <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button className="btn-primary" onClick={() => alert('Checkout flow not implemented in Phase-1')}>Proceed to Checkout</button>
          <button className="btn-outline" onClick={() => clearCart()}>Clear Cart</button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
