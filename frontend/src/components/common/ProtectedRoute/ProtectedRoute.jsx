import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext, USER_ROLES } from '../../../context';
import { Loader } from '../Loader/Loader';

/**
 * ProtectedRoute - Protects routes from unauthorized access
 * 
 * @param {ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} redirectTo - Path to redirect if unauthorized (default: "/")
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/' 
}) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  // Show loader while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Not authenticated - redirect to login page
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);
    
    if (!hasRequiredRole) {
      // User doesn't have required role - redirect based on their actual role
      const fallbackPath = user?.role === USER_ROLES.STUDENT 
        ? '/HomePage' 
        : user?.role === USER_ROLES.FACULTY 
          ? '/DepartmentHome' 
          : '/';
      
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Authorized - render the protected component
  return children;
}

/**
 * StudentRoute - Shorthand for routes only accessible by students
 */
export function StudentRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * FacultyRoute - Shorthand for routes only accessible by faculty
 */
export function FacultyRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.FACULTY]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * AuthenticatedRoute - Routes accessible by any authenticated user
 */
export function AuthenticatedRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT, USER_ROLES.FACULTY]}>
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;
