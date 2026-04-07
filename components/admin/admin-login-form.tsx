'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Invalid email or password');
      }

      router.replace('/admin/dashboard');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-[#0d1120]/85 py-0 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <CardHeader className="space-y-4 border-b border-white/8 px-8 py-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-purple-200 uppercase">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin Access
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-black tracking-tight text-white">Admin Login</CardTitle>
          <CardDescription className="text-sm leading-6 text-white/65">
            Sign in to manage Funtern applications, review resumes, and update candidate status securely.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-white">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@funtern.co"
              className="h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/35 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-white">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/35 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-[0_18px_50px_rgba(124,58,237,0.34)] hover:from-violet-500 hover:to-purple-500"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LockKeyhole className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
