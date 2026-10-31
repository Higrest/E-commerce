import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../../components/Layout';
import { ProductList } from '../../features/catalog/ProductList';
import { ProductDetail } from '../../features/catalog/ProductDetail';
import { CartPage } from '../../features/cart/CartPage';
import { FavoritesPage } from '../../features/favorites/FavoritesPage';
import { Login } from '../../features/auth/Login';
import { Register } from '../../features/auth/Register';
import { OrderHistory } from '../../features/orders/OrderHistory';
import { OrderTracking } from '../../features/orders/OrderTracking';
import { SellerDashboard } from '../../features/seller-dash/SellerDashboard';
import { ManageProducts } from '../../features/seller-dash/ManageProducts';
import { AdminDashboard } from '../../features/admin-dash/AdminDashboard';
import ProductApprovals from '../../features/admin-dash/ProductApprovals';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Публичные страницы
      { path: '', element: <ProductList /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'auth/login', element: <Login /> },
      { path: 'auth/register', element: <Register /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: '/admin/products', element: <ProductApprovals /> },
      // Защищенные страницы покупателя (Customer)
      {
        element: <ProtectedRoute allowedRoles={['customer', 'user']} />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'orders/history', element: <OrderHistory /> },
          { path: 'orders/track/:id', element: <OrderTracking /> },
        ],
      },
      
      // Защищенные страницы продавца (Seller)
      {
        element: <ProtectedRoute allowedRoles={['seller']} />,
        children: [
          { path: 'seller/dashboard', element: <SellerDashboard /> },
          { path: 'seller/products', element: <ManageProducts /> },
        ],
      },
      
      // Защищенные страницы администратора (Admin)
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: 'admin/dashboard', element: <AdminDashboard /> },
        ],
      },
    ],
  },
]);
