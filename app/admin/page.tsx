import { redirect } from 'next/navigation';
import { DeferredBackgroundField } from '@/components/DeferredBackgroundField';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { getAdminSessionToken } from '@/lib/admin-session';

export default async function AdminLoginPage() {
  const token = await getAdminSessionToken();
  if (token) {
    redirect('/admin/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DeferredBackgroundField />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(34,211,238,0.14),transparent_22%)]" />
        <div className="relative mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-purple-200 uppercase">
              Funtern Admin
            </div>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Secure access for the application review team
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/70">
                Sign in to review applicants, inspect uploaded resumes, update statuses, and manage the full Funtern opportunity pipeline.
              </p>
            </div>
          </div>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
