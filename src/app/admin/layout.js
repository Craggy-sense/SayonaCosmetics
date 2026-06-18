"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoginPage = pathname === '/admin/login';

  // Auth guard redirects at top level (complying with React's Rules of Hooks)
  useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        router.replace('/admin/login');
      } else if (user && isLoginPage) {
        router.replace('/admin/dashboard');
      }
    }
  }, [user, loading, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (loading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'grid', 
          placeItems: 'center', 
          backgroundColor: 'var(--color-neutral-light)',
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '1.2rem'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ marginBottom: '16px' }}>👑</div>
          <p>Loading Sayona CMS...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in and is on the login page, render login page children
  if (!user && isLoginPage) {
    return <>{children}</>;
  }

  // If user is not logged in and not on login page, wait for redirect
  if (!user) {
    return null;
  }

  // If user is logged in and on login page, wait for redirect
  if (isLoginPage) {
    return null;
  }

  // Authenticated full CMS Shell layout
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          Sayona CMS
        </div>
        
        <nav className="admin-sidebar-nav" style={{ flexGrow: 1 }}>
          <Link 
            href="/admin/dashboard" 
            className={`admin-sidebar-nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}
          >
            📊 Orders Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`admin-sidebar-nav-link ${pathname === '/admin/products' ? 'active' : ''}`}
          >
            🛍️ Manage Products
          </Link>
          <Link 
            href="/admin/blogs" 
            className={`admin-sidebar-nav-link ${pathname === '/admin/blogs' ? 'active' : ''}`}
          >
            ✍️ Manage Blogs
          </Link>
          <Link 
            href="/admin/settings" 
            className={`admin-sidebar-nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            ⚙️ Page Settings
          </Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          <Link 
            href="/" 
            className="admin-sidebar-nav-link" 
            target="_blank"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', color: 'var(--color-accent)' }}
          >
            🌐 View Storefront
          </Link>
          <button 
            onClick={handleLogout}
            className="admin-sidebar-nav-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              width: '100%', 
              textAlign: 'left',
              color: 'rgba(255, 100, 100, 0.9)'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="admin-main-panel">
        {children}
      </main>
    </div>
  );
}
