'use client';

import { useState } from 'react';
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
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'apex-shell',
      name: 'Apex Technical Shell',
      category: 'Outerwear',
      size: 'L',
      color: 'Graphite',
      price: 54450,
      qty: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQdBVOB7nuJT7bluq3_-5wlTeWlVA8B41hJqOg5ZV5EPYI6KK-uuH1-mkKH-ULDSjtefXFB1JHuktwliGqU8bi7-KdU06YSvh9_6eVkXzGj2c8_cwFhJ4pQE3pMh6A3LmmOjfEPtmtGujRs7XC8AkxEaRhfP0knNO1b5942yqkt3tnMEnzVmCUPbe3WqHZud7lifUtaLCvlVuieLst6JYoHk1NZjLMSrt2WfbSPWWbQX_mOfhMD_0daw',
    },
    {
      id: 'titan-boots',
      name: 'Titan Boots',
      category: 'Footwear',
      size: '10.5',
      color: 'Midnight',
      price: 35200,
      qty: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC73HgchiYugH85NalWSCIjsjzXWJr-xNybGbKkx0P79c1M67bDw8-PFGYqgWGXrc1y7YVXFF_R6qmIhQN0D7o4VErafhyJPArCQJvzpGVx3Yal0E0TavqUh4wzGfHFcyXS6D0d8NGIf9xPyKTNqRnRaoQWQy5q5TxRaXwhR1oISrv66yyKv_F1mDucvvjCzDtOYQklusE6FoYSOv3JsWZW-LXfocWqmL-ULtHEITaAf72kt6JI51vl5A',
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = items.length > 0 ? 1650 : 0;
  // Dynamic tax calculation: 8% of subtotal, rounded to nearest 10 for original consistency (e.g. 89650 * 0.08 = 7172 -> 7170)
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

        {items.length === 0 ? (
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
              className="bg-secondary text-on-secondary font-label-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
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
                  key={item.id}
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
                      <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-low">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="p-2 hover:bg-surface-variant transition-colors text-primary flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1.5 font-label-bold text-sm min-w-[3rem] text-center border-x border-outline-variant/20 text-primary">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="p-2 hover:bg-surface-variant transition-colors text-primary flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-outline hover:text-error transition-colors font-label-bold text-sm"
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
                  className="inline-flex items-center gap-2.5 font-label-bold text-primary hover:text-secondary transition-colors"
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
                  className="w-full bg-secondary hover:opacity-90 py-4 rounded-lg font-label-bold text-on-secondary shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-sm hover:opacity-90 active:scale-95 transition-all"
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
