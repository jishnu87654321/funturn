export type AdminUser = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected';

export type AdminApplication = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  selectedCategory: string | null;
  selectedCategoryName: string;
  instagramLink: string;
  linkedinLink: string;
  resumeOriginalName: string;
  resumeMimeType: string;
  resumeSize: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminApplicationDetail = AdminApplication & {
  collegeName: string;
  city: string;
  message: string;
  source: string;
  notes: string;
  resumePath: string;
  statusHistory: Array<{
    status: ApplicationStatus;
    note?: string;
    changedAt: string;
  }>;
};

export type DashboardSummary = {
  totals: {
    totalApplications: number;
    newApplications: number;
    reviewedApplications: number;
    shortlistedApplications: number;
    rejectedApplications: number;
    todayApplications: number;
  };
  byCategory: Array<{
    categoryName: string;
    count: number;
  }>;
  recentApplications: Array<{
    _id?: string;
    fullName: string;
    email: string;
    selectedCategoryName: string;
    status: ApplicationStatus;
    createdAt: string;
  }>;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
