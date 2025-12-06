// frontend/src/features/auth/hooks/useAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api';
import { useNotification } from '../../../hooks';

/**
 * Auth hook - Updated for new backend response format
 * Backend now returns: { success: true, data: {...}, message: "..." }
 */
export function useAuth() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const login = async (accountId, accountPass) => {
    setLoading(true);
    try {
      // Backend returns: { success: true, data: { account_id, status, last_login }, message: "..." }
      const response = await authApi.login(accountId, accountPass);

      if (response.success) {
        // Store username
        localStorage.setItem('userName', accountId);
        
        // Show success message from backend
        showSuccess(response.message || 'Login successful!');

        // Navigate based on role
        // Backend returns status as 'Student', 'Faculty', or 'Admin'
        const status = response.data.status;
        
        if (status === 'Student') {
          navigate('/HomePage');
        } else if (status === 'Faculty' || status === 'Admin') {
          navigate('/DepartmentHome');
        } else {
          showError('Invalid account status');
        }
      }
    } catch (error) {
      // Backend error format: { success: false, message: "...", error_code: "..." }
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (accountId, accountPass) => {
    setLoading(true);
    try {
      // Backend returns: { success: true, data: { account_id, status }, message: "..." }
      const response = await authApi.register(accountId, accountPass);
      
      if (response.success) {
        showSuccess(response.message || 'Registration successful!');
        return true;
      }
      return false;
    } catch (error) {
      showError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (accountId, oldPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await authApi.changePassword(accountId, oldPassword, newPassword);
      
      if (response.success) {
        showSuccess(response.message || 'Password changed successfully!');
        return true;
      }
      return false;
    } catch (error) {
      showError(error.message || 'Password change failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAccountInfo = async (accountId) => {
    setLoading(true);
    try {
      const response = await authApi.getAccountInfo(accountId);
      return response.data;
    } catch (error) {
      showError(error.message || 'Failed to fetch account info');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userName');
    navigate('/');
  };

  return { 
    login, 
    register, 
    changePassword,
    getAccountInfo,
    logout, 
    loading 
  };
}

// Example usage in a component:
/*
function LoginComponent() {
  const { login, loading } = useAuth();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(accountId, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={accountId} 
        onChange={(e) => setAccountId(e.target.value)}
        placeholder="Account ID"
      />
      <input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
*/