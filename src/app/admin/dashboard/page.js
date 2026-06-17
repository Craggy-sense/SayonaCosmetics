"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    productsCount: 0,
    blogsCount: 0,
    ordersCount: 0,
    totalSales: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch orders ordered by creation date
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const orderSnap = await getDocs(q);
        
        let loadedOrders = [];
        let salesSum = 0;
        orderSnap.forEach((doc) => {
          const data = doc.data();
          loadedOrders.push({ id: doc.id, ...data });
          salesSum += data.subtotal || 0;
        });

        // Fetch products count
        const productSnap = await getDocs(collection(db, 'products'));
        const productsCount = productSnap.size;

        // Fetch blogs count
        const blogSnap = await getDocs(collection(db, 'blogs'));
        const blogsCount = blogSnap.size;

        setOrders(loadedOrders);
        setStats({
          productsCount,
          blogsCount,
          ordersCount: loadedOrders.length,
          totalSales: salesSum
        });
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Filter orders based on query (checks order ID, product title, and date)
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase();
    const matchesId = order.id.toLowerCase().includes(q);
    const matchesItems = order.items && order.items.some(item => 
      item.title.toLowerCase().includes(q) || item.size.toLowerCase().includes(q)
    );
    const matchesDate = formatDate(order.createdAt).toLowerCase().includes(q);
    return matchesId || matchesItems || matchesDate;
  });

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders Dashboard</h1>
        <div style={{ color: 'rgba(31, 27, 28, 0.6)', fontSize: '0.9rem' }}>
          Real-time metrics &amp; WhatsApp logs ledger
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-primary)' }}>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Quick Metrics Grid */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <span className="admin-metric-label">Total Checkout Requests</span>
              <span className="admin-metric-value">{stats.ordersCount}</span>
            </div>
            
            <div className="admin-metric-card">
              <span className="admin-metric-label">Logged Pipeline Value</span>
              <span className="admin-metric-value">KSh {formatPrice(stats.totalSales)}</span>
            </div>

            <div className="admin-metric-card">
              <span className="admin-metric-label">Catalog Products</span>
              <span className="admin-metric-value">{stats.productsCount}</span>
            </div>

            <div className="admin-metric-card">
              <span className="admin-metric-label">Published Articles</span>
              <span className="admin-metric-value">{stats.blogsCount}</span>
            </div>
          </div>

          {/* Checkout Logs Ledger */}
          <div className="admin-page-header" style={{ borderBottom: 'none', marginBottom: '16px', paddingBottom: 0 }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
              WhatsApp Checkout Ledger
            </h2>
            <div className="search-wrapper" style={{ margin: 0, width: '320px' }}>
              <input 
                type="text" 
                className="admin-input" 
                placeholder="Search by product, date, size..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', borderRadius: 'var(--border-radius-sm)' }}
              />
            </div>
          </div>

          <div className="admin-table-container">
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(31, 27, 28, 0.5)' }}>
                No checkout logs found matching "{searchQuery}"
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date Placed</th>
                    <th>Order Items (Size &amp; Qty)</th>
                    <th>Subtotal Value</th>
                    <th>Delivery Scope</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.9rem' }}>
                              🎁 <strong>{item.title}</strong> ({item.size}) - {item.qty} pcs
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>
                        KSh {formatPrice(order.subtotal || 0)}
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            backgroundColor: order.deliveryType?.includes('Free') ? '#e6f4ea' : '#fef7e0',
                            color: order.deliveryType?.includes('Free') ? '#137333' : '#b06000',
                            fontWeight: '600'
                          }}
                        >
                          {order.deliveryType || 'Standard'}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            backgroundColor: '#e8f0fe',
                            color: '#1a73e8',
                            fontWeight: '600'
                          }}
                        >
                          {order.status ? order.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
}
