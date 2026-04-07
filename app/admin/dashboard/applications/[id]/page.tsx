import { redirect } from 'next/navigation';
import { DeferredBackgroundField } from '@/components/DeferredBackgroundField';
import { ApplicationDetailsPage } from '@/components/admin/application-details-page';
import { getAdminSessionToken } from '@/lib/admin-session';

export default async function AdminApplicationDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getAdminSessionToken();
  if (!token) {
    redirect('/admin');
  }

  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DeferredBackgroundField />
      <section className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <ApplicationDetailsPage applicationId={id} />
        </div>
      </section>
    </main>
  );
}
