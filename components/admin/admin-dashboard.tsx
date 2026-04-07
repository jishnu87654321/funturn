'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationsTable } from '@/components/admin/applications-table';
import { DashboardHeader } from '@/components/admin/dashboard-header';
import { FiltersBar, type AdminFiltersState } from '@/components/admin/filters-bar';
import { SummaryCards } from '@/components/admin/summary-cards';
import type {
  AdminApplication,
  AdminUser,
  ApplicationStatus,
  DashboardSummary,
  PaginationMeta,
} from '@/components/admin/types';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const initialFilters: AdminFiltersState = {
  search: '',
  category: 'all',
  status: 'all',
  sort: 'newest',
};

export function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<AdminFiltersState>(initialFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const deferredSearch = useDeferredValue(filters.search);

  const categoryOptions = useMemo(
    () =>
      summary?.byCategory?.map((item) => item.categoryName).filter(Boolean).sort((left, right) => left.localeCompare(right)) ||
      [],
    [summary],
  );

  const handleUnauthorized = () => {
    router.replace('/admin');
    router.refresh();
  };

  const loadAdmin = async () => {
    const response = await fetch('/api/admin/me', { cache: 'no-store' });
    const payload = (await response.json()) as ApiResponse<{ admin: AdminUser }>;

    if (response.status === 401 || !payload.success || !payload.data?.admin) {
      handleUnauthorized();
      return;
    }

    setAdmin(payload.data.admin);
  };

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard/summary', { cache: 'no-store' });
      const payload = (await response.json()) as ApiResponse<DashboardSummary>;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || 'Unable to load dashboard summary');
      }

      setSummary(payload.data);
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        sort: filters.sort,
      });

      if (deferredSearch.trim()) params.set('search', deferredSearch.trim());
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.status !== 'all') params.set('status', filters.status);

      const response = await fetch(`/api/admin/applications?${params.toString()}`, { cache: 'no-store' });
      const payload = (await response.json()) as ApiResponse<{
        applications: AdminApplication[];
        pagination: PaginationMeta;
      }>;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || 'Unable to load applications');
      }

      setApplications(payload.data.applications);
      setPagination(payload.data.pagination);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmin();
    void loadSummary();
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [page, filters.sort, filters.category, filters.status, deferredSearch]);

  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.status, filters.sort, deferredSearch]);

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json()) as ApiResponse<{ application: AdminApplication }>;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !payload.success || !payload.data?.application) {
        throw new Error(payload.message || 'Unable to update application status');
      }

      const updated = payload.data.application;
      setApplications((current) =>
        current.map((application) =>
          application.id === updated.id ? { ...application, status: updated.status, updatedAt: updated.updatedAt } : application,
        ),
      );
      await loadSummary();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update application status');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader admin={admin} onLogout={handleLogout} loggingOut={loggingOut} />
      <SummaryCards summary={summaryLoading ? null : summary} />
      <FiltersBar filters={filters} categories={categoryOptions} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />

      {error ? (
        <div className="flex flex-col gap-3 rounded-[1.6rem] border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-sm text-rose-100/85">{error}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void loadSummary();
              void loadApplications();
            }}
            className="h-10 rounded-xl border-rose-200/20 bg-transparent text-rose-100 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}

      <ApplicationsTable
        applications={applications}
        pagination={pagination}
        page={page}
        loading={loading}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
