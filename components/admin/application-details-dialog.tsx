'use client';

import { ExternalLink, FileDown, LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminApplicationDetail, ApplicationStatus } from '@/components/admin/types';

function statusBadgeClass(status: ApplicationStatus) {
  if (status === 'reviewed') return 'bg-amber-500/15 text-amber-100 border-amber-400/25';
  if (status === 'shortlisted') return 'bg-emerald-500/15 text-emerald-100 border-emerald-400/25';
  if (status === 'rejected') return 'bg-rose-500/15 text-rose-100 border-rose-400/25';
  return 'bg-cyan-500/15 text-cyan-100 border-cyan-400/25';
}

const formatValue = (value?: string) => (value && value.trim() ? value : '—');

export function ApplicationDetailsDialog({
  application,
  open,
  loading,
  onOpenChange,
  onStatusChange,
  statusUpdating,
}: {
  application: AdminApplicationDetail | null;
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ApplicationStatus) => Promise<void>;
  statusUpdating: boolean;
}) {
  const detailRows = [
    ['Full Name', application?.fullName],
    ['Email', application?.email],
    ['Phone Number', application?.phoneNumber],
    ['Qualification', application?.qualification],
    ['Selected Category', application?.selectedCategoryName],
    ['College Name', application?.collegeName],
    ['City', application?.city],
    ['Source', application?.source],
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[min(96vw,1100px)] max-w-[1100px] overflow-y-auto rounded-[1.75rem] border-white/10 bg-[#0d1120] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <DialogHeader className="border-b border-white/8 px-6 py-5">
          <DialogTitle className="text-2xl font-bold text-white">
            {application?.fullName || 'Application Details'}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/60">
            Review the full applicant profile, resume access, and current status.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16 text-white/70">
            <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
            Loading application details...
          </div>
        ) : application ? (
          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(330px,0.8fr)]">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="grid gap-4">
                  {detailRows.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[170px_minmax(0,1fr)] items-start gap-x-6 gap-y-1">
                      <span className="pt-1 text-xs font-semibold tracking-[0.12em] uppercase text-white/45">
                        {label}
                      </span>
                      <span className="min-w-0 break-words text-sm leading-7 text-white/90">{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="rounded-[1.15rem] border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">Status</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Badge
                      className={`min-w-[108px] justify-center rounded-full border px-3 py-1 ${statusBadgeClass(application.status)}`}
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <Select
                      value={application.status}
                      onValueChange={(value) => void onStatusChange(value as ApplicationStatus)}
                      disabled={statusUpdating}
                    >
                      <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#111526] text-white">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-[1.15rem] border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">Applied Date</p>
                  <p className="mt-2 text-sm leading-7 text-white/90">{new Date(application.createdAt).toLocaleString()}</p>
                </div>

                <div className="rounded-[1.15rem] border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">Resume</p>
                  <p className="mt-2 break-words text-sm leading-7 text-white/90">
                    {formatValue(application.resumeOriginalName)}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-2xl border-white/12 bg-white/5 text-white hover:bg-white/10"
                    >
                      <a href={`/api/admin/applications/${application.id}/resume`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View Resume
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500"
                    >
                      <a href={`/api/admin/applications/${application.id}/resume?download=1`}>
                        <FileDown className="h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">Instagram Link</p>
                <p className="mt-2 break-words text-sm leading-7 text-white/90">{formatValue(application.instagramLink)}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">LinkedIn Profile</p>
                <p className="mt-2 break-words text-sm leading-7 text-white/90">{formatValue(application.linkedinLink)}</p>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/45">Message / Note</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/85">{formatValue(application.message)}</p>
            </div>
          </div>
        ) : (
          <div className="px-6 py-16 text-center text-sm text-white/65">Select an application to view details.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
