'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Package, Headphones, ArrowRight, CreditCard, ShoppingBag, Search, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

interface ShippingForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export default function CheckoutPage() {
  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderStatus !== 'idle') return;

    setOrderStatus('processing');
    setTimeout(() => {
      setOrderStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {/* Breadcrumb & Title */}
        <div className="mb-12">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Checkout</h1>
          <Breadcrumb
            items={[
              { label: 'Cart', href: '#cart' },
              { label: 'Shipping & Payment' },
              { label: 'Review', href: '#review' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Shipping Form & Payment */}
          <section className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-card border border-outline/10">
              <div className="flex items-center gap-3 mb-8 border-b border-outline/10 pb-4">
                <Package className="text-primary" size={24} />
                <h2 className="font-headline-md text-headline-md text-primary">Shipping Information</h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-label-bold text-label-bold text-on-surface-variant">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Alex Jensen"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-label-bold text-on-surface-variant">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-label-bold text-on-surface-variant">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="123 Industrial Way"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block font-label-bold text-label-bold text-on-surface-variant">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Portland"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-bold text-label-bold text-on-surface-variant">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Oregon"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-bold text-label-bold text-on-surface-variant">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={form.zip}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-background/50 border border-outline/20 rounded-xl px-4 py-3 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="97201"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-outline/10 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-primary" size={24} />
                    <h2 className="font-headline-md text-headline-md text-primary">Payment Method</h2>
                  </div>

                  <div className="relative group cursor-pointer">
                    <div className="flex items-center justify-between p-4 bg-primary/5 border-2 border-secondary rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full border-4 border-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        </div>
                        <div>
                          <p className="font-label-bold text-primary">Cash on Delivery</p>
                          <p className="text-xs text-on-surface-variant font-body-md">Pay with cash upon delivery of your items.</p>
                        </div>
                      </div>
                      <CreditCard className="text-secondary" size={20} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="hidden" id="checkout-form-submit-btn" />
              </form>
            </div>
          </section>

          {/* Right Column: Order Summary Card */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-surface-container-high p-8 rounded-xl shadow-card border border-outline/10">
              <h2 className="font-headline-md text-headline-md text-primary mb-8">Order Summary</h2>

              {/* Items */}
              <div className="space-y-6 mb-8">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS_7JAMzihV3gTcrdfY1Qh1m0EwrDlxmVxl5_WhRz_zTeyI2NDo-MqC67GlCxGuEcMUZA08iZeE1gZL2pvI83sKYa4lgHKeWRqlczW8-FjKNHuV1fW45tYJxxdv0nfdlz8eH6g6yMxWR8CgRZdxs6xDlCmPRgkBobX4HjGNJMwIFKou_GCm2xi83e-AeLqpqEfX-fh2bvcSoyC6TmLMxIKfifRsHIMw-HE58M40bkWOdJQ_JyQOVAEqg"
                      alt="MK-1 Tactical Pack"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <h3 className="font-label-bold text-primary">MK-1 Tactical Pack</h3>
                      <p className="text-sm text-on-surface-variant font-body-md">Black / One Size</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-label-bold text-on-surface-variant">Qty: 1</span>
                      <span className="font-label-bold text-primary">৳ 22,570</span>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yVInvAM1nk_qOEa5qvZZBSk-0n_LaWYGFgwCOTDrxi3ZKw4zGINSKw2f_hEOxu_NQ57OEwbujFVDoVsOWNeoUjHzzP0BLhjKEtFqH2GAQLbwv0jVO9kRNpxLOhCJcspGZYS_8CI3wtzdg6WPzJ7a-PdX2YbZc_V7dsoCmQBkt3uWOFeRSmlYIE06SkNlYA0BoiKddCWezYVOAtJPeLrVRoCGTYNMUGdOrINPYi4OZ5MT2mtEtepzcg"
                      alt="Garrison Utility Shell"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <h3 className="font-label-bold text-primary">Garrison Utility Shell</h3>
                      <p className="text-sm text-on-surface-variant font-body-md">Slate Gray / Large</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-label-bold text-on-surface-variant">Qty: 1</span>
                      <span className="font-label-bold text-primary">৳ 29,280</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculations */}
              <div className="space-y-4 pt-6 border-t border-outline/10">
                <div className="flex justify-between text-on-surface-variant font-body-md">
                  <span>Subtotal</span>
                  <span>৳ 51,850</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-body-md">
                  <span>Shipping</span>
                  <span className="text-secondary font-label-bold uppercase tracking-wider text-xs">Free</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-body-md">
                  <span>Tax</span>
                  <span>৳ 4,150</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary/10 mt-4">
                  <span className="font-headline-md text-headline-md text-primary">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">৳ 56,000</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  const submitBtn = document.getElementById('checkout-form-submit-btn');
                  if (submitBtn) submitBtn.click();
                }}
                className={`w-full mt-8 text-white py-4 rounded-xl font-label-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                  orderStatus === 'success'
                    ? 'bg-emerald-600 shadow-emerald-600/20'
                    : orderStatus === 'processing'
                    ? 'bg-secondary/80 cursor-not-allowed shadow-secondary/10'
                    : 'bg-secondary hover:bg-secondary/90 shadow-secondary/20 active:scale-[0.98]'
                }`}
              >
                {orderStatus === 'idle' && (
                  <>
                    <span>Place Order</span>
                    <ArrowRight size={16} />
                  </>
                )}
                {orderStatus === 'processing' && (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                )}
                {orderStatus === 'success' && (
                  <>
                    <CheckCircle size={18} />
                    <span>Order Placed</span>
                  </>
                )}
              </button>

              {/* Trust Signals */}
              <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
                <div className="flex flex-col items-center gap-1">
                  <Shield size={20} className="text-primary" />
                  <span className="text-[10px] font-label-bold uppercase tracking-tighter">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Package size={20} className="text-primary" />
                  <span className="text-[10px] font-label-bold uppercase tracking-tighter">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Headphones size={20} className="text-primary" />
                  <span className="text-[10px] font-label-bold uppercase tracking-tighter">24/7 Support</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
