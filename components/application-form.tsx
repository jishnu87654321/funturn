'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle2, FileText, LoaderCircle, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^https?:\/\/.+/i.test(value), {
    message: 'Please enter a valid URL starting with http:// or https://',
  });

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => phoneRegex.test(value), 'Please enter a valid phone number'),
  qualification: z.string().trim().min(2, 'Qualification is required'),
  selectedCategory: z.string().trim().min(1, 'Unable to prepare your application right now'),
  resume: z
    .custom<File | null>((value) => value instanceof File, { message: 'Resume is required' })
    .refine((file) => !file || ACCEPTED_RESUME_TYPES.includes(file.type), 'Only PDF, DOC, and DOCX files are allowed')
    .refine((file) => !file || file.size <= MAX_RESUME_SIZE, 'File size must be under 10 MB'),
  instagramLink: optionalUrlSchema,
  linkedinLink: optionalUrlSchema,
  message: z.string().trim().max(500, 'Please keep your note under 500 characters').optional().or(z.literal('')),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

type Category = {
  _id: string;
  name: string;
  shortDescription?: string;
  icon?: string;
};

type CategoriesResponse = {
  success: boolean;
  message?: string;
  data?: {
    categories?: Category[];
  };
};

type ApplicationResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

const inputClassName =
  'h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/35 focus-visible:border-purple-400 focus-visible:ring-purple-400/30';

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-300">{message}</p>;
}

export function ApplicationForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      qualification: '',
      selectedCategory: '',
      resume: null,
      instagramLink: '',
      linkedinLink: '',
      message: '',
    },
  });

  const selectedResume = watch('resume');
  const acceptedFileSummary = useMemo(() => 'PDF, DOC, DOCX • Max 10 MB', []);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError('');

    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      const payload = (await response.json()) as CategoriesResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Unable to load opportunities.');
      }

      const nextCategories = payload.data?.categories || [];
      setCategories(nextCategories);

      if (nextCategories.length > 0) {
        setValue('selectedCategory', nextCategories[0]._id, { shouldValidate: true });
      }
    } catch (error) {
      setCategoriesError(error instanceof Error ? error.message : 'Unable to load opportunities.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const clearResume = () => {
    setValue('resume', null, { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!values.resume) {
      setError('resume', { type: 'manual', message: 'Resume is required' });
      return;
    }

    const formData = new FormData();
    formData.append('fullName', values.fullName.trim());
    formData.append('email', values.email.trim().toLowerCase());
    formData.append('phoneNumber', values.phoneNumber.trim());
    formData.append('qualification', values.qualification.trim());
    formData.append('selectedCategory', values.selectedCategory);
    formData.append('resume', values.resume);

    if (values.instagramLink.trim()) {
      formData.append('instagramLink', values.instagramLink.trim());
    }

    if (values.linkedinLink.trim()) {
      formData.append('linkedinLink', values.linkedinLink.trim());
    }

    if (values.message?.trim()) {
      formData.append('message', values.message.trim());
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as ApplicationResponse;

      if (!response.ok || !payload.success) {
        if (payload.errors) {
          for (const [field, message] of Object.entries(payload.errors)) {
            if (
              field === 'fullName' ||
              field === 'email' ||
              field === 'phoneNumber' ||
              field === 'qualification' ||
              field === 'selectedCategory' ||
              field === 'resume' ||
              field === 'instagramLink' ||
              field === 'linkedinLink' ||
              field === 'message'
            ) {
              setError(field, { type: 'server', message });
            }
          }
        }

        throw new Error(payload.message || 'Application submission failed.');
      }

      setSubmitSuccess(payload.message || 'Application submitted successfully');
      reset({
        fullName: '',
        email: '',
        phoneNumber: '',
        qualification: '',
        selectedCategory: categories[0]?._id || '',
        resume: null,
        instagramLink: '',
        linkedinLink: '',
        message: '',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Application submission failed.');
    }
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-purple-200">
          <span>Apply</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Apply to Funtern</h1>
          <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Start your Funtern journey. Submit your details and upload your resume to apply for internships,
            bootcamps, workshops, competitions, and more.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Quick, student-friendly application flow',
            'Secure resume upload from your device',
            'Opportunities synced from live Funtern updates',
            'Optional social links for a stronger profile',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-white/75"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-purple-400/20 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_45%),rgba(255,255,255,0.03)] p-5">
          <p className="text-sm font-semibold text-white">What to expect</p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Share your basics and upload a resume from your device. We keep the process short, clear, and
            mobile-friendly.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#0d1120]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-bold text-white">Submit your details</h2>
          <p className="text-sm leading-6 text-white/65">
            Fill in your details and upload your resume to apply for exciting Funtern opportunities.
          </p>
        </div>

        {submitSuccess ? (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-4 text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Application submitted successfully</p>
              <p className="mt-1 text-sm text-emerald-100/80">{submitSuccess}</p>
            </div>
          </div>
        ) : null}

        {submitError ? (
          <div className="mb-6 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {submitError}
          </div>
        ) : null}

        {categoriesError ? (
          <div className="mb-6 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {categoriesError}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                className={inputClassName}
                aria-invalid={Boolean(errors.fullName)}
                {...register('fullName')}
              />
              <FieldError message={errors.fullName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={inputClassName}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="+91 98765 43210"
                className={inputClassName}
                aria-invalid={Boolean(errors.phoneNumber)}
                {...register('phoneNumber')}
              />
              <FieldError message={errors.phoneNumber?.message} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="qualification" className="text-white">
                Qualification
              </Label>
              <Input
                id="qualification"
                placeholder="B.Tech CSE, BBA, Class 12, etc."
                className={inputClassName}
                aria-invalid={Boolean(errors.qualification)}
                {...register('qualification')}
              />
              <FieldError message={errors.qualification?.message} />
            </div>
          </div>

          <input type="hidden" {...register('selectedCategory')} />

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-white">
              Resume Upload
            </Label>
            <input
              ref={fileInputRef}
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setValue('resume', file, { shouldValidate: true, shouldDirty: true });
              }}
            />
            <div
              className={cn(
                'rounded-[1.5rem] border border-dashed px-4 py-4 transition',
                errors.resume
                  ? 'border-rose-400/60 bg-rose-500/10'
                  : 'border-white/12 bg-white/[0.03] hover:border-purple-300/40',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl bg-purple-500/15 p-2 text-purple-200">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {selectedResume ? 'Resume selected' : 'Upload your resume'}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{acceptedFileSummary}</p>
                    {selectedResume ? (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-sm text-white/80">
                        <FileText className="h-4 w-4 text-purple-200" />
                        <span className="max-w-[220px] truncate">{selectedResume.name}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/12 bg-white/5 px-4 text-white hover:bg-white/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedResume ? 'Replace file' : 'Choose file'}
                  </Button>
                  {selectedResume ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full px-4 text-white/70 hover:bg-white/10 hover:text-white"
                      onClick={clearResume}
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
            <FieldError message={errors.resume?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-white">
                Instagram Link <span className="text-white/45">(optional)</span>
              </Label>
              <Input
                id="instagramLink"
                placeholder="https://instagram.com/yourprofile"
                className={inputClassName}
                aria-invalid={Boolean(errors.instagramLink)}
                {...register('instagramLink')}
              />
              <FieldError message={errors.instagramLink?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinLink" className="text-white">
                LinkedIn Profile <span className="text-white/45">(optional)</span>
              </Label>
              <Input
                id="linkedinLink"
                placeholder="https://linkedin.com/in/yourprofile"
                className={inputClassName}
                aria-invalid={Boolean(errors.linkedinLink)}
                {...register('linkedinLink')}
              />
              <FieldError message={errors.linkedinLink?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Short note <span className="text-white/45">(optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us what excites you about Funtern."
              className="min-h-28 rounded-[1.5rem] border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus-visible:border-purple-400 focus-visible:ring-purple-400/30"
              aria-invalid={Boolean(errors.message)}
              {...register('message')}
            />
            <FieldError message={errors.message?.message} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || categoriesLoading || !!categoriesError || categories.length === 0}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-[0_18px_50px_rgba(124,58,237,0.34)] hover:from-violet-500 hover:to-purple-500"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Now'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
