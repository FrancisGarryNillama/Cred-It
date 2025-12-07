import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Button, Input } from '../../../components/common';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm({ onClose }) {
  const [accountID, setAccountID] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountID || !accountPass) {
      alert('Please fill in all fields');
      return;
    }

    await login(accountID, accountPass);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Account ID"
        value={accountID}
        onChange={(e) => setAccountID(e.target.value)}
        icon={User}
        autoComplete="username"
      />

      <Input
        type="password"
        placeholder="Password"
        value={accountPass}
        onChange={(e) => setAccountPass(e.target.value)}
        icon={Lock}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
    </form>
  );
}
