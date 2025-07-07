import React from 'react';
import { useCart } from './CartContext';
import './Cart.css'; 

export default function Cart() {
  const { cart, setCart, updateQuantity, removeFromCart } = useCart();

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ items: cart })
      });

      if (!response.ok) throw new Error('Failed to place order');

      alert('Order placed successfully!');
      setCart([]);
    } catch (error) {
      alert('Error placing order');
      console.error(error);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="cart-actions">
                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
