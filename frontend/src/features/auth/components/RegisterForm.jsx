import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Button, Input } from '../../../components/common';
import { useAuth } from '../hooks/useAuth';

export default function RegisterForm({ onClose, onSuccess }) {
  const [accountID, setAccountID] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountID || !accountPass || !confirmPass) {
      alert('Please fill in all fields');
      return;
    }

    if (accountPass.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (accountPass !== confirmPass) {
      alert('Passwords do not match');
      return;
    }

    const success = await register(accountID, accountPass);
    if (success) {
      setAccountID('');
      setAccountPass('');
      setConfirmPass('');
      if (onSuccess) onSuccess();
    }
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
        autoComplete="new-password"
      />

      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        icon={Lock}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Register
      </Button>
    </form>
  );
}
