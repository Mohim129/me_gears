'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Printer, MapPin, CreditCard, Info, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BentoCard from '@/components/ui/BentoCard';
import OrderTimeline from '@/components/ui/OrderTimeline';

type StepType = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState<StepType>('Shipped');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Tracking update information text based on step
  const getTrackingInfo = (step: StepType) => {
    switch (step) {
      case 'Pending':
        return 'Your order has been received and is waiting for packing verification. We will process it shortly.';
      case 'Confirmed':
        return 'Your order has been verified and confirmed. It is currently being packed in our main distribution center.';
      case 'Shipped':
        return 'Your package is currently in transit with Express Logistics. It was last scanned at the regional distribution center in North Chicago. Expected delivery: Nov 18, 2024.';
      case 'Delivered':
        return 'Your order was successfully delivered and signed for by Marcus Sterling at 2:14 PM, Nov 18, 2024.';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {/* Header & Order Meta */}
        <div className="mb-12">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Order Details</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Orders', href: '/orders' },
                  { label: '#ME-49201-GL' },
                ]}
              />
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Order <span className="font-bold text-primary">#ME-49201-GL</span> • Placed on{' '}
                <span className="font-bold text-primary">November 12, 2024</span>
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-lowest hover:bg-surface-container border border-outline/10 rounded-xl font-label-bold text-label-bold text-primary transition-all duration-300 active:scale-95 shadow-sm"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Demo Controller: Allows toggling status dynamically */}
        <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-label-bold text-primary uppercase tracking-wider">
            Simulate Status Update:
          </span>
          <div className="flex flex-wrap gap-2">
            {(['Pending', 'Confirmed', 'Shipped', 'Delivered'] as StepType[]).map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-bold transition-all ${
                  currentStep === step
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-white hover:bg-surface-container text-on-surface-variant border border-outline/10'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Order Status Timeline (Bento Style Card) */}
        <BentoCard className="mb-8">
          <OrderTimeline activeStep={currentStep} />

          <div className="mt-10 p-6 bg-surface-container-low rounded-lg border border-outline/5 flex items-start gap-4">
            <Info className="text-secondary shrink-0 mt-0.5" size={20} />
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {getTrackingInfo(currentStep)}
            </p>
          </div>
        </BentoCard>

        {/* Details Grid (Shipping & Payment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Info Card */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-primary" size={24} />
              <h2 className="font-headline-md text-headline-md text-primary">Shipping Address</h2>
            </div>
            <div className="space-y-2">
              <p className="font-label-bold text-label-bold text-primary">Marcus Sterling</p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                492 Industrial Way, Suite 12B
                <br />
                Brooklyn, NY 11205
                <br />
                United States
              </p>
              <p className="pt-4 font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                <span className="font-bold">Phone:</span> +1 (555) 230-4921
              </p>
            </div>
          </BentoCard>

          {/* Payment Info Card */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-primary" size={24} />
              <h2 className="font-headline-md text-headline-md text-primary">Payment Method</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                <CreditCard className="text-secondary shrink-0" size={24} />
                <div>
                  <p className="font-label-bold text-label-bold text-primary">Cash on Delivery</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Pay when your order arrives</p>
                </div>
              </div>
              <div className="pt-2 border-t border-outline/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-label-bold text-primary">৳ 50,260</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md text-on-surface-variant">Shipping</span>
                  <span className="font-label-bold text-primary">Free</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline/10">
                  <span className="font-headline-md text-headline-md text-primary">Total</span>
                  <span className="font-headline-md text-headline-md text-secondary">৳ 50,260</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Order Items */}
        <BentoCard className="overflow-hidden p-0 md:p-0">
          <div className="p-8 border-b border-outline/10">
            <h2 className="font-headline-md text-headline-md text-primary">Order Summary</h2>
          </div>
          <div className="divide-y divide-outline/10">
            {/* Item 1 */}
            <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:bg-surface-container-low/30 transition-colors">
              <div className="relative w-full sm:w-32 aspect-[3/4] bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4OcK5fXQxhIu4mIZUjFdYmz3zJkj_uF8-his9E9pW8WRNcX-U5bl2WQj6GiFMCz1QZg55nFdKbBawAoENxbQSeMi-zCMn9wZJiOUzzpLo5HmNs_XP3MIBbrFRi-EXAO6VCsNb_SMgS8gwR19WrH9fvfr6CCp3yjhNE_WIxNZb-M5Pa2_zRB8URufxdZPk9XTbhprk0cca3uMG17HHxYZzofTHJizOWU0rZsALFzo782nqwOLXhFQ5_A"
                  alt="IronClad Tactical Jacket"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors cursor-pointer">
                    IronClad Tactical Jacket
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Color: Slate Gray | Size: Large</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="font-body-md text-on-surface-variant">Qty: 1</span>
                  <span className="font-label-bold text-headline-md text-primary">৳ 34,770</span>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:bg-surface-container-low/30 transition-colors">
              <div className="relative w-full sm:w-32 aspect-[3/4] bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe9vbQesLzQ2dD9j3AF3gbzMDsLizI9EsfIUbmyTjEMJyLBaui4rAc7WqiatFwnygnY9gf9ZgAm62qINkPs5jFgaE_dJk4gpz3LYbksZacO1wpP_V8IbrAMWZW-_bjzTe_1ZmrRM_WCqEuHA3IVqPEyGCmgo1UW_tawPAczlr0qglB2LiVy1VnPuBXG6qtChC9UXhr8kWyEYAv5ZoyMNJLl1IrB99EHh8V54xP-o3mtU0hOWBWZ6Fd5Q"
                  alt="Vanguard Cargo Pant"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 128px"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors cursor-pointer">
                    Vanguard Cargo Pant
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Color: Midnight Black | Size: 34W</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="font-body-md text-on-surface-variant">Qty: 1</span>
                  <span className="font-label-bold text-headline-md text-primary">৳ 15,490</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-surface-container-low/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-outline" size={24} />
              <p className="font-body-md text-body-md text-on-surface-variant">30-Day Easy Returns Policy Applied</p>
            </div>
            <button className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary font-label-bold text-label-bold rounded-lg transition-all duration-300 active:scale-95 shadow-sm">
              Track via SMS
            </button>
          </div>
        </BentoCard>
      </main>

      <Footer />
    </div>
  );
}
