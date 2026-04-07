import { redirect } from 'next/navigation';
import { DeferredBackgroundField } from '@/components/DeferredBackgroundField';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getAdminSessionToken } from '@/lib/admin-session';

export default async function AdminDashboardPage() {
  const token = await getAdminSessionToken();
  if (!token) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DeferredBackgroundField />
      <section className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <AdminDashboard />
        </div>
      </section>
    </main>
  );
}
