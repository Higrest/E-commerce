import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Если роль пользователя не входит в массив разрешенных ролей для этой страницы
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Или на страницу 403 / Forbidden
  }

  return <Outlet />;
};
