import { auth } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ManageItemPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
    cookies: await cookies(),
  });

  if (!session) redirect('/login');
  redirect('/admin/inventory');
}
