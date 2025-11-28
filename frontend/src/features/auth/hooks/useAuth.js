import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api';
import { useNotification } from '../../../hooks';

export function useAuth() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const login = async (accountID, accountPass) => {
    setLoading(true);
    try {
      const data = await authApi.login(accountID, accountPass);

      if (data.message) {
        // Store username
        localStorage.setItem('userName', accountID);
        showSuccess('Login successful!');

        // Navigate based on role
        if (data.status === 'Student') {
          navigate('/HomePage');
        } else if (data.status === 'Faculty') {
          navigate('/DepartmentHome');
        } else {
          showError('Unauthorized role');
        }
      }
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (accountID, accountPass) => {
    setLoading(true);
    try {
      const data = await authApi.register(accountID, accountPass);
      showSuccess(data.message || 'Registration successful!');
      return true;
    } catch (error) {
      showError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userName');
    navigate('/');
  };

  return { login, register, logout, loading };
}