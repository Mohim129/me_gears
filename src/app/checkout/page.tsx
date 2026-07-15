'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Package, Headphones, ArrowRight, CreditCard, ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
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

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/cart');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setItems(json.data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderStatus !== 'idle') return;
    if (items.length === 0) return;

    setOrderStatus('processing');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: form,
          paymentMethod: 'Cash on Delivery',
        }),
      });

      if (!res.ok) {
        throw new Error('Order creation failed');
      }

      const json = await res.json();
      if (json.success) {
        setOrderId(json.data.id);
        setOrderStatus('success');
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        throw new Error(json.error || 'Failed to place order');
      }
    } catch (err: any) {
      alert(err.message || 'Error placing order. Please try again.');
      setOrderStatus('idle');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Free standard shipping for checkout
  const tax = items.length > 0 ? Math.round((subtotal * 0.08) / 10) * 10 : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {orderStatus === 'success' ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/30 px-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Order Confirmed!</h1>
            <p className="text-on-surface-variant font-body-md mb-6 leading-relaxed">
              Thank you for your purchase. Your order <span className="font-bold text-primary">#{orderId}</span> is being processed and will ship soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/orders/${orderId}`}
                className="bg-secondary text-on-secondary font-label-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all text-sm"
              >
                Track Order
              </Link>
              <Link
                href="/shop"
                className="border border-outline/10 text-primary font-label-bold px-6 py-3 rounded-xl hover:bg-surface-container transition-all text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Breadcrumb & Title */}
            <div className="mb-12">
              <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Checkout</h1>
              <Breadcrumb
                items={[
                  { label: 'Cart', href: '/cart' },
                  { label: 'Shipping & Payment' },
                  { label: 'Review' },
                ]}
              />
            </div>

            {items.length === 0 && !isLoading ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-2xl shadow-card border border-outline/10">
                <ShoppingBag className="mx-auto text-outline/30 mb-4" size={48} />
                <h3 className="font-headline-md text-lg text-primary mb-2">Your checkout cart is empty</h3>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-label-bold text-sm tracking-wider uppercase transition-all"
                >
                  <ArrowLeft size={16} />
                  <span>Go to Shop</span>
                </Link>
              </div>
            ) : (
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

                        <div className="relative group">
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
                    <div className="max-h-[360px] overflow-y-auto space-y-6 mb-8 pr-2">
                      {isLoading ? (
                        <div className="space-y-4">
                          <div className="h-16 w-full bg-surface-variant animate-pulse rounded" />
                          <div className="h-16 w-full bg-surface-variant animate-pulse rounded" />
                        </div>
                      ) : (
                        items.map((item) => (
                          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                            <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                              <div>
                                <h3 className="font-label-bold text-primary truncate text-sm">{item.name}</h3>
                                <p className="text-xs text-on-surface-variant font-body-md truncate">
                                  {item.color} / {item.size}
                                </p>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-label-bold text-on-surface-variant">Qty: {item.quantity}</span>
                                <span className="font-label-bold text-primary">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Calculations */}
                    <div className="space-y-4 pt-6 border-t border-outline/10">
                      <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
                        <span>Subtotal</span>
                        <span>৳ {subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
                        <span>Shipping</span>
                        <span className="text-secondary font-label-bold uppercase tracking-wider text-xs">Free</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
                        <span>Tax</span>
                        <span>৳ {tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-primary/10 mt-4">
                        <span className="font-headline-md text-headline-md text-primary">Total</span>
                        <span className="font-headline-md text-headline-md text-primary">৳ {total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      disabled={orderStatus === 'processing' || items.length === 0}
                      onClick={() => {
                        const submitBtn = document.getElementById('checkout-form-submit-btn');
                        if (submitBtn) submitBtn.click();
                      }}
                      className={`w-full mt-8 text-white py-4 rounded-xl font-label-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg cursor-pointer ${
                        orderStatus === 'processing'
                          ? 'bg-secondary/80 cursor-not-allowed shadow-secondary/10'
                          : 'bg-secondary hover:bg-secondary/90 shadow-secondary/20 active:scale-[0.98]'
                      }`}
                    >
                      {orderStatus === 'processing' ? (
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
                      ) : (
                        <>
                          <span>Place Order</span>
                          <ArrowRight size={16} />
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
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
