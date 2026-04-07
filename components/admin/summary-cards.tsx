'use client';

import { Eye, FileStack, FileText, Medal, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardSummary } from '@/components/admin/types';

const cardConfig = [
  { key: 'totalApplications', label: 'Total Applications', icon: FileStack, tone: 'from-white/12 to-white/5' },
  { key: 'newApplications', label: 'New Applications', icon: FileText, tone: 'from-cyan-500/18 to-cyan-500/6' },
  { key: 'reviewedApplications', label: 'Reviewed', icon: Eye, tone: 'from-amber-500/18 to-amber-500/6' },
  { key: 'shortlistedApplications', label: 'Shortlisted', icon: Medal, tone: 'from-emerald-500/18 to-emerald-500/6' },
  { key: 'rejectedApplications', label: 'Rejected', icon: XCircle, tone: 'from-rose-500/18 to-rose-500/6' },
] as const;

export function SummaryCards({ summary }: { summary: DashboardSummary | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cardConfig.map(({ key, label, icon: Icon, tone }) => (
        <Card key={key} className={`border-white/10 bg-gradient-to-br ${tone} py-0 shadow-[0_18px_40px_rgba(0,0,0,0.18)]`}>
          <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">{label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-white">
                {summary?.totals[key] ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-white/80">
              <Icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
