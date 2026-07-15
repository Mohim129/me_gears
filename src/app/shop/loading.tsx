import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@heroui/react';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 max-w-[1280px] mx-auto px-6 w-full">
        <div className="space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_auto] items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3 rounded-full" />
              <Skeleton className="h-5 w-2/3 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-4 justify-start lg:justify-end">
              <Skeleton className="h-12 w-40 rounded-2xl" />
              <Skeleton className="h-12 w-28 rounded-2xl" />
            </div>
          </div>

          <div className="flex gap-12">
            <aside className="hidden lg:block w-64 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2 rounded-full" />
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full rounded-2xl" />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-2/3 rounded-full" />
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full rounded-2xl" />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-2/3 rounded-full" />
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-12 rounded-2xl" />
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full rounded-[26px]" />
                    <Skeleton className="h-5 w-3/4 rounded-full" />
                    <Skeleton className="h-4 w-1/2 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-12 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
