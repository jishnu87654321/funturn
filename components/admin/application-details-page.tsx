'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, FileDown, LoaderCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminApplicationDetail, ApplicationStatus } from '@/components/admin/types';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

function statusBadgeClass(status: ApplicationStatus) {
  if (status === 'reviewed') return 'bg-amber-500/15 text-amber-100 border-amber-400/25';
  if (status === 'shortlisted') return 'bg-emerald-500/15 text-emerald-100 border-emerald-400/25';
  if (status === 'rejected') return 'bg-rose-500/15 text-rose-100 border-rose-400/25';
  return 'bg-cyan-500/15 text-cyan-100 border-cyan-400/25';
}

const formatValue = (value?: string) => (value && value.trim() ? value : '—');

export function ApplicationDetailsPage({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [application, setApplication] = useState<AdminApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApplication = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/admin/applications/${applicationId}`, { cache: 'no-store' });
        const payload = (await response.json()) as ApiResponse<{ application: AdminApplicationDetail }>;

        if (response.status === 401) {
          router.replace('/admin');
          router.refresh();
          return;
        }

        if (!response.ok || !payload.success || !payload.data?.application) {
          throw new Error(payload.message || 'Unable to load application details');
        }

        setApplication(payload.data.application);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load application details');
      } finally {
        setLoading(false);
      }
    };

    void loadApplication();
  }, [applicationId, router]);

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!application) {
      return;
    }

    setStatusUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/applications/${application.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json()) as ApiResponse<{ application: AdminApplicationDetail }>;

      if (response.status === 401) {
        router.replace('/admin');
        router.refresh();
        return;
      }

      if (!response.ok || !payload.success || !payload.data?.application) {
        throw new Error(payload.message || 'Unable to update application status');
      }

      setApplication(payload.data.application);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update application status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const detailRows = application
    ? [
        ['Full Name', application.fullName],
        ['Email', application.email],
        ['Phone Number', application.phoneNumber],
        ['Qualification', application.qualification],
        ['Selected Category', application.selectedCategoryName],
        ['College Name', application.collegeName],
        ['City', application.city],
        ['Source', application.source],
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">{application?.fullName || 'Application details'}</h1>
          <p className="text-sm leading-6 text-white/65">
            Review the full applicant profile, resume access, and current status in one aligned view.
          </p>
        </div>
        {application ? (
          <Badge className={`min-w-[124px] justify-center rounded-full border px-4 py-2 text-sm ${statusBadgeClass(application.status)}`}>
            {application.status}
          </Badge>
        ) : null}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 px-6 py-20 text-white/70 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
          Loading application details...
        </div>
      ) : error ? (
        <div className="rounded-[1.8rem] border border-rose-400/20 bg-rose-500/10 px-6 py-5 text-rose-100 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <p className="font-semibold">Unable to load this application</p>
          <p className="mt-2 text-sm text-rose-100/85">{error}</p>
        </div>
      ) : application ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            <div className="rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="grid gap-5">
                {detailRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[180px_minmax(0,1fr)] items-start gap-x-8 gap-y-1">
                    <span className="pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">{label}</span>
                    <span className="min-w-0 break-words text-sm leading-7 text-white/90">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Status</p>
                <div className="mt-3 flex items-center gap-3">
                  <Badge className={`min-w-[116px] justify-center rounded-full border px-3 py-1.5 ${statusBadgeClass(application.status)}`}>
                    {application.status}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Select value={application.status} onValueChange={(value) => void handleStatusChange(value as ApplicationStatus)} disabled={statusUpdating}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-white">
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

              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Applied Date</p>
                <p className="mt-3 text-sm leading-7 text-white/90">{new Date(application.createdAt).toLocaleString()}</p>
              </div>

              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Resume</p>
                <p className="mt-3 break-words text-sm leading-7 text-white/90">{formatValue(application.resumeOriginalName)}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="outline" className="h-12 w-full rounded-2xl border-white/12 bg-white/5 text-white hover:bg-white/10">
                    <a href={`/api/admin/applications/${application.id}/resume`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View Resume
                    </a>
                  </Button>
                  <Button asChild className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500">
                    <a href={`/api/admin/applications/${application.id}/resume?download=1`}>
                      <FileDown className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Instagram Link</p>
              <p className="mt-3 break-words text-sm leading-7 text-white/90">{formatValue(application.instagramLink)}</p>
            </div>
            <div className="rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">LinkedIn Profile</p>
              <p className="mt-3 break-words text-sm leading-7 text-white/90">{formatValue(application.linkedinLink)}</p>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Message / Note</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/85">{formatValue(application.message)}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
