import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api';
import { useNotification } from '../../../hooks';

export function useAuth() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const login = async (accountId, accountPass) => {
    setLoading(true);
    try {
      const response = await authApi.login(accountId, accountPass);

      if (response.success) {
        localStorage.setItem('userName', accountId);
        showSuccess(response.message || 'Login successful!');

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
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (accountId, accountPass) => {
    setLoading(true);
    try {
      if (accountPass.length < 8) {
        showError('Password must be at least 8 characters long');
        return false;
      }

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

  return { login, register, changePassword, getAccountInfo, logout, loading };
}
