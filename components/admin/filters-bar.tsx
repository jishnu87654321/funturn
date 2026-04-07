'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ApplicationStatus } from '@/components/admin/types';

export type AdminFiltersState = {
  search: string;
  category: string;
  status: 'all' | ApplicationStatus;
  sort: 'newest' | 'oldest';
};

export function FiltersBar({
  filters,
  categories,
  onChange,
}: {
  filters: AdminFiltersState;
  categories: string[];
  onChange: (patch: Partial<AdminFiltersState>) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl lg:grid-cols-[minmax(0,1.3fr)_220px_180px_160px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by name, email, or phone"
          className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/35 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
        />
      </div>

      <Select value={filters.category} onValueChange={(value) => onChange({ category: value })}>
        <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111526] text-white">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => onChange({ status: value as AdminFiltersState['status'] })}>
        <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111526] text-white">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="reviewed">Reviewed</SelectItem>
          <SelectItem value="shortlisted">Shortlisted</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={(value) => onChange({ sort: value as AdminFiltersState['sort'] })}>
        <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Sort Order" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111526] text-white">
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
