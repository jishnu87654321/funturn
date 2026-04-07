'use client';

import Link from 'next/link';
import { ExternalLink, FileDown, SearchX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminApplication, ApplicationStatus, PaginationMeta } from '@/components/admin/types';

function statusBadgeClass(status: ApplicationStatus) {
  if (status === 'reviewed') return 'bg-amber-500/15 text-amber-100 border-amber-400/25';
  if (status === 'shortlisted') return 'bg-emerald-500/15 text-emerald-100 border-emerald-400/25';
  if (status === 'rejected') return 'bg-rose-500/15 text-rose-100 border-rose-400/25';
  return 'bg-cyan-500/15 text-cyan-100 border-cyan-400/25';
}

const formatValue = (value?: string) => (value && value.trim() ? value : '—');

export function ApplicationsTable({
  applications,
  pagination,
  page,
  loading,
  onPageChange,
  onStatusChange,
}: {
  applications: AdminApplication[];
  pagination: PaginationMeta | null;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => Promise<void>;
}) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0d1120]/90 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <Table className="min-w-[1400px]">
          <TableHeader className="sticky top-0 z-10 bg-[#111526]">
            <TableRow className="border-white/10 hover:bg-transparent">
              {['S.No', 'Name', 'Email', 'Phone', 'Qualification', 'Category', 'Instagram', 'LinkedIn', 'Resume', 'Status', 'Applied Date', 'Actions'].map((heading) => (
                <TableHead key={heading} className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="border-white/8">
                  {Array.from({ length: 12 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex} className="px-4 py-4">
                      <div className="h-4 w-full max-w-[120px] animate-pulse rounded-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow className="border-white/8 hover:bg-transparent">
                <TableCell colSpan={12} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/60">
                    <SearchX className="h-8 w-8" />
                    <p className="text-base font-medium text-white/80">No applications found</p>
                    <p className="text-sm">Try a different search term or filter combination.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application, index) => (
                <TableRow key={application.id} className="border-white/8 align-middle hover:bg-white/[0.03]">
                  <TableCell className="px-4 py-4 text-sm text-white/70">
                    {(page - 1) * (pagination?.limit || 10) + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4 align-middle">
                    <div className="max-w-[180px]">
                      <p className="truncate font-semibold text-white">{application.fullName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="max-w-[220px] truncate text-white/80" title={application.email}>
                      {application.email}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-white/80">{application.phoneNumber}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="max-w-[180px] truncate text-white/80" title={application.qualification}>
                      {formatValue(application.qualification)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="max-w-[170px] truncate text-white/80" title={application.selectedCategoryName}>
                      {formatValue(application.selectedCategoryName)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-white/80">
                    {application.instagramLink ? (
                      <a href={application.instagramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">
                        Open <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-white/80">
                    {application.linkedinLink ? (
                      <a href={application.linkedinLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">
                        Open <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex min-w-[180px] items-center gap-2">
                      <Button asChild variant="outline" className="h-9 rounded-xl border-white/12 bg-white/5 px-3 text-white hover:bg-white/10">
                        <a href={`/api/admin/applications/${application.id}/resume`} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="h-9 rounded-xl border-white/12 bg-white/5 px-3 text-white hover:bg-white/10">
                        <a href={`/api/admin/applications/${application.id}/resume?download=1`}>
                          <FileDown className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex min-w-[160px] items-center gap-2">
                      <Badge className={`min-w-[104px] justify-center rounded-full border ${statusBadgeClass(application.status)}`}>
                        {application.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-white/75">{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex min-w-[220px] items-center gap-2">
                      <Button asChild variant="outline" className="h-9 rounded-xl border-white/12 bg-white/5 px-3 text-white hover:bg-white/10">
                        <Link href={`/admin/dashboard/applications/${application.id}`}>View Details</Link>
                      </Button>
                      <Select value={application.status} onValueChange={(value) => void onStatusChange(application.id, value as ApplicationStatus)}>
                        <SelectTrigger className="h-9 w-[130px] rounded-xl border-white/12 bg-white/5 text-white">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">
          {pagination
            ? `Showing page ${pagination.page} of ${pagination.totalPages} • ${pagination.total} total applications`
            : 'Loading pagination...'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!pagination || pagination.page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="h-10 rounded-xl border-white/12 bg-white/5 px-4 text-white hover:bg-white/10"
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!pagination || pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(Math.min(pagination?.totalPages || page, page + 1))}
            className="h-10 rounded-xl border-white/12 bg-white/5 px-4 text-white hover:bg-white/10"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
