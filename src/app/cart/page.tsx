'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, Lock, Truck, RotateCcw, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  image: string;
  stock: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [quantityErrors, setQuantityErrors] = useState<Record<string, string>>({});

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/cart');
      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }
      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((item: any) => ({
          id: item.productId,
          name: item.name,
          category: item.category || 'Gear',
          size: item.size || 'M',
          color: item.color || 'Default',
          price: item.price || 0,
          qty: item.quantity || 1,
          image: item.image || '',
          stock: Number(item.stock ?? item.product?.stock ?? 0),
        }));
        setItems(mapped);
      } else {
        throw new Error(json.error || 'Failed to load cart items');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id: string, delta: number, currentQty: number, size: string, color: string, maxStock: number) => {
    const newQty = currentQty + delta;
    const itemKey = `${id}-${size}-${color}`;
    if (newQty <= 0) return;
    if (delta > 0 && newQty > maxStock) {
      setQuantityErrors((prev) => ({ ...prev, [itemKey]: maxStock > 0 ? `Only ${maxStock} available` : 'Out of stock' }));
      return;
    }

    setQuantityErrors((prev) => ({ ...prev, [itemKey]: '' }));

    try {
      setIsLoading(true);
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: newQty, size, color }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Failed to update quantity');
      }

      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((item: any) => ({
          id: item.productId,
          name: item.name,
          category: item.category || 'Gear',
          size: item.size || 'M',
          color: item.color || 'Default',
          price: item.price || 0,
          qty: item.quantity || 1,
          image: item.image || '',
          stock: Number(item.stock ?? item.product?.stock ?? 0),
        }));
        setItems(mapped);
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        throw new Error(json.error || 'Failed to update quantity');
      }
    } catch (err: any) {
      setQuantityErrors((prev) => ({ ...prev, [itemKey]: err.message || 'Error updating quantity.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string, size: string, color: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    try {
      setIsLoading(true);
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, size, color }),
      });

      if (!res.ok) {
        throw new Error('Failed to remove item');
      }

      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((item: any) => ({
          id: item.productId,
          name: item.name,
          category: item.category || 'Gear',
          size: item.size || 'M',
          color: item.color || 'Default',
          price: item.price || 0,
          qty: item.quantity || 1,
          image: item.image || '',
          stock: Number(item.stock ?? item.product?.stock ?? 0),
        }));
        setItems(mapped);
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        throw new Error(json.error || 'Failed to remove item');
      }
    } catch (err: any) {
      alert(err.message || 'Error removing item.');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = items.length > 0 ? 1650 : 0;
  const tax = items.length > 0 ? Math.round((subtotal * 0.08) / 10) * 10 : 0;
  const total = subtotal + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      alert('Promo code applied successfully (demo)!');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-6 max-w-[1280px] mx-auto w-full">
        <header className="mb-10">
          <h1 className="font-headline-xl text-[36px] sm:text-[48px] font-bold text-primary mb-2">
            Your Cart
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            Review your selections before heading to checkout.
          </p>
        </header>

        {error ? (
          <div className="text-center py-16 text-error font-body-md bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-2xl">
            <p className="mb-4">{error}</p>
            <button onClick={fetchCart} className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-bold text-sm cursor-pointer">
              Retry
            </button>
          </div>
        ) : isLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/30 text-center">
            <svg className="animate-spin h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-on-surface-variant font-label-bold mt-4">Loading your cart items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/30 text-center px-4">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-primary/60 mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">
              Your cart is empty
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-sm mb-8">
              Looks like you haven't added any rugged gear to your cart yet. Explore our latest technical collection.
            </p>
            <Link
              href="/shop"
              className="bg-secondary text-on-secondary font-label-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/10 group hover:shadow-md transition-all duration-300"
                >
                  {/* Image Container with 3:4 Aspect Ratio */}
                  <div className="relative w-full sm:w-36 aspect-[3/4] overflow-hidden rounded-lg bg-surface-container flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 150px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block bg-surface-container px-2.5 py-0.5 rounded text-[10px] font-label-bold uppercase tracking-wider text-on-surface-variant mb-2">
                          {item.category}
                        </span>
                        <h3 className="font-headline-md text-[20px] text-primary group-hover:text-secondary transition-colors duration-200">
                          {item.name}
                        </h3>
                        <p className="font-body-md text-on-surface-variant mt-1.5 text-sm">
                          Size: <span className="font-semibold text-primary">{item.size}</span> | Color: <span className="font-semibold text-primary">{item.color}</span>
                        </p>
                      </div>
                      <p className="font-headline-md text-[18px] text-primary shrink-0">
                        ৳ {item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity Selector */}
                      <div>
                        <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-low">
                          <button
                            onClick={() => updateQty(item.id, -1, item.qty, item.size, item.color, item.stock)}
                            className="p-2 hover:bg-surface-variant transition-colors text-primary flex items-center justify-center cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1.5 font-label-bold text-sm min-w-[3rem] text-center border-x border-outline-variant/20 text-primary">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1, item.qty, item.size, item.color, item.stock)}
                            disabled={item.qty >= item.stock}
                            className={`p-2 transition-colors text-primary flex items-center justify-center ${item.qty >= item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-variant cursor-pointer'}`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {quantityErrors[`${item.id}-${item.size}-${item.color}`] ? (
                          <p className="mt-2 text-xs text-error">
                            {quantityErrors[`${item.id}-${item.size}-${item.color}`]}
                          </p>
                        ) : null}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="flex items-center gap-1.5 text-outline hover:text-error transition-colors font-label-bold text-sm cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 font-label-bold text-primary hover:text-secondary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-surface-container-high p-8 rounded-xl shadow-card border border-outline-variant/10">
                <h2 className="font-headline-md text-[22px] text-primary mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-label-bold text-primary">
                      ৳ {subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="font-label-bold text-primary">
                      ৳ {shipping.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                    <span>Tax Estimations</span>
                    <span className="font-label-bold text-primary">
                      ৳ {tax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-primary">
                      Total
                    </span>
                    <span className="font-headline-md text-headline-md text-secondary">
                      ৳ {total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-secondary hover:opacity-90 py-4 rounded-lg font-label-bold text-on-secondary shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-outline-variant/20 pt-6 text-on-surface-variant/70">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Lock className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-label-bold uppercase tracking-wider">
                      Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-label-bold uppercase tracking-wider">
                      Fast
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <RotateCcw className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-label-bold uppercase tracking-wider">
                      30-Day
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Card */}
              <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm">
                <label className="block font-label-bold text-sm text-primary mb-3">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow px-4 py-2 bg-surface-container rounded-lg border-none focus:ring-1 focus:ring-secondary text-body-md text-primary outline-none"
                    placeholder="Enter code"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-secondary mt-2 font-medium">
                    Demo promo code applied!
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
