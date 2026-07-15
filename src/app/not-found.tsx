import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, HardHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full text-center relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02] bg-gradient-to-b from-primary/10 to-transparent"
          style={{
            backgroundImage: 'radial-gradient(rgb(22, 40, 57) 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          {/* Construction/Warning Icon */}
          <div className="flex justify-center">
            <div className="p-6 bg-primary/5 rounded-full border border-primary/10 text-secondary animate-bounce">
              <HardHat size={64} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="font-display-logo text-8xl font-black tracking-widest text-primary">
              404
            </h1>
            <h2 className="font-headline-lg text-2xl text-on-surface uppercase tracking-wider">
              Way Off Grid
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
              The coordinate you requested does not exist in our industrial database. It might have been moved or dismantled.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all duration-300 uppercase tracking-wider"
            >
              <ArrowLeft size={16} />
              <span>Back to Base</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
