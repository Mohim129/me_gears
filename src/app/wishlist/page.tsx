'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import BentoCard from '@/components/ui/BentoCard';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isFavorite: boolean;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/wishlist');
      if (!res.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          isFavorite: true,
        }));
        setWishlist(mapped);
      } else {
        throw new Error(json.error || 'Failed to load wishlist items');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleFavorite = async (id: string) => {
    // Optimistic UI updates
    setWishlist((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event('wishlist-updated'));
      } else {
        fetchWishlist();
      }
    } catch (err) {
      console.error(err);
      fetchWishlist();
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      // 1. Add to cart
      const cartRes = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          quantity: 1,
        }),
      });

      if (!cartRes.ok) {
        throw new Error('Could not add item to cart');
      }

      // 2. Remove from wishlist
      const wishRes = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id }),
      });

      if (wishRes.ok) {
        setWishlist((prev) => prev.filter((i) => i.id !== item.id));
        window.dispatchEvent(new Event('cart-updated'));
        window.dispatchEvent(new Event('wishlist-updated'));
        alert(`Moved "${item.name}" to cart!`);
      } else {
        throw new Error('Failed to remove item from wishlist');
      }
    } catch (err: any) {
      alert(err.message || 'Error transferring item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {/* Header & Meta */}
        <header className="mb-12">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">My Wishlist</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} saved for later
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Account Sidebar */}
          <AccountSidebar />

          {/* Grid Content */}
          <section className="flex-grow w-full">
            {error ? (
              <div className="text-center py-16 text-error font-body-md bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-2xl">
                <p className="mb-4">{error}</p>
                <button onClick={fetchWishlist} className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-bold text-sm cursor-pointer">
                  Retry
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden p-4 border border-outline/10 gap-3">
                    <div className="aspect-[3/4] w-full bg-surface-variant animate-pulse rounded-lg" />
                    <div className="h-4 w-3/4 bg-surface-variant animate-pulse rounded" />
                    <div className="h-4 w-1/4 bg-surface-variant animate-pulse rounded" />
                    <div className="h-10 w-full bg-surface-variant animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : wishlist.length === 0 ? (
              <BentoCard className="text-center py-16">
                <Heart className="mx-auto text-outline/30 mb-4" size={48} />
                <h3 className="font-headline-md text-lg text-primary mb-2">Your wishlist is empty</h3>
                <p className="text-sm text-on-surface-variant font-body-md max-w-sm mx-auto mb-6">
                  Add high-performance gear to your wishlist while browsing the shop to save them for later.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer"
                >
                  <span>Go Shopping</span>
                  <ArrowRight size={16} />
                </Link>
              </BentoCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-card border border-outline/10 p-4 transition-all duration-300 hover:shadow-lg">
                    {/* Image Container with 3:4 Aspect Ratio */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-container mb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors duration-200 z-10 cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-200 ${
                            item.isFavorite
                              ? 'fill-secondary text-secondary'
                              : 'text-on-surface-variant'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-grow">
                      <h3 className="font-headline-md text-[18px] text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="font-body-md text-on-surface-variant font-label-bold mb-4">
                        ৳ {item.price.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="mt-auto w-full bg-secondary text-white py-3 rounded-lg font-label-bold hover:bg-secondary-container transition-colors active:scale-95 duration-200 uppercase tracking-wider text-xs cursor-pointer"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
