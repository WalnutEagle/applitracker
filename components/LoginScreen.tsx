
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { LockClosedIcon } from './icons/LockClosedIcon';

interface LoginScreenProps {
  onLogin: (username: string, password) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-[var(--primary-600)]/20 p-3 rounded-full mb-4">
          <LockClosedIcon className="h-8 w-8 text-[var(--accent-400)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">Application Tracker</h1>
        <p className="text-[var(--text-light)]">Please sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Username"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        
        {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <Button type="submit" variant="primary" className="w-full">
          Sign In
        </Button>
      </form>
    </Card>
  );
};

export default LoginScreen;