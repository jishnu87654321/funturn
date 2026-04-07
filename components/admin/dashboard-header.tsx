'use client';

import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/components/admin/types';

export function DashboardHeader({
  admin,
  onLogout,
  loggingOut,
}: {
  admin: AdminUser | null;
  onLogout: () => Promise<void>;
  loggingOut: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-cyan-100 uppercase">
          <ShieldCheck className="h-3.5 w-3.5" />
          Protected Admin Area
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm leading-6 text-white/65">
            Review applicant data, track application status, and access resumes securely from one place.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/75">
          Logged in as <span className="font-semibold text-white">{admin?.email || 'Admin'}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void onLogout()}
          disabled={loggingOut}
          className="h-11 rounded-2xl border-white/12 bg-white/5 px-4 text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}
