import AdminLayoutClient from './AdminLayoutClient';

export const metadata = {
  title: 'ME GEARS | Admin Dashboard',
  description: 'Admin panel for ME GEARS — manage orders, products, and analytics.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
