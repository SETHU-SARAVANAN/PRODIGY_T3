import React, { useEffect, useState } from 'react';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Failed to fetch orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to cancel order');

      alert('Order canceled successfully!');
      fetchOrders(); // Refresh orders after cancel
    } catch (err) {
      alert('Error canceling order');
      console.error(err);
    }
  };

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>

            <div className="order-items">
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - ₹{item.price} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <button className="cancel-btn" onClick={() => handleCancelOrder(order._id)}>
              Cancel Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}
