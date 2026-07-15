import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[1280px] mx-auto px-6">
        <div className="space-y-8">
          <div className="h-6 w-1/3 rounded-full bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-[3/4] w-full rounded-2xl bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-2xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-1/4 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-10 w-3/4 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-8 w-1/2 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 w-24 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-14 w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-1/2 rounded-full bg-gray-200 animate-pulse" />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="h-6 w-full rounded-full bg-gray-200 animate-pulse" />
              <div className="h-6 w-full rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-40 w-full rounded-2xl bg-gray-200 animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="h-10 w-1/3 rounded-full bg-gray-200 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="space-y-4"
                >
                  <div className="aspect-[3/4] w-full rounded-2xl bg-gray-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
