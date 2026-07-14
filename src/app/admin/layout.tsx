import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export const metadata = {
  title: 'ME GEARS | Admin Dashboard',
  description: 'Admin panel for ME GEARS — manage orders, products, and analytics.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
