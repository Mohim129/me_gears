'use client';

import { useState } from 'react';
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

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'w1',
    name: 'Apex Technical Shell',
    price: 54300, // 445 * 122 rounded
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA72IDqHuPK8b5Ctkp6rOm9s-t_mNqU6-VwEIE73DRVzbxEfjWdwuIux0Sv2utJEbGpysKm5HzM5lEfUx7wD4iDvuarrJ9KX6blso1FnHtBuXug0NEtGYWwxzKi6EmaaH1B0r5lMoqE49QrxQQvABP5SoU99Za2ngM91qN49P9bUGF1Zo2pVnOJKI7w9awfFkJiS880nXvW6vT6pZGvRHZEUkkaZpdSGzSxIYjsMslTrDaX5l3zdATR2g',
    isFavorite: true,
  },
  {
    id: 'w2',
    name: 'Nomad Pack 30L',
    price: 34200, // 280 * 122 rounded
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-uXD2KLcR3IDvXSuOGoz4NkC5oDJjc9h0vj2TL8915aelollHGi0-9k0nebNnLU3FE6u_r1fOhPt2JuNQzUyifn8itg-ZMgFHMzDTjNZt4Ih4rWj-MhWcRXvbUODYPwf7kWb-fRyGA6XKJmlXwLnK0asfg85lVPi1Pt2S89zD_hg8fgGHRrHDHR-tloPMpPFykkdnaTzCBzngtllmwtBhIzBrOgSP4jwSrOrnVpTGZgx-jlIukfg4lA',
    isFavorite: true,
  },
  {
    id: 'w3',
    name: 'Titan Boots',
    price: 39000, // 320 * 122 rounded
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHyw_EvVUMr267jEC4ADCyH-kEj5apmZ_4NjCSBNbhcOWpgw2dWoTT9I15dn_8dMScrSYUAmKdvv4qrXxYsRnEFhA3PrNQXGqRapGysl7tCtnOZZjYjR2W17U8YEHhVnA-UBWoWOmBSSqjrAqiLPG4kQxQOEPm64vxXUt9vT7aWYeaxFuO3N-mxYPgvm_72eZDosog0f9G_Uhf2TLB_q9vNrwbvQ3PO8xTfd6XV6glVm-u_EsJEO0hfg',
    isFavorite: true,
  },
  {
    id: 'w4',
    name: 'Core Element Hoodie',
    price: 20100, // 165 * 122 rounded
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE8fOF92tg447r8E0VIMw7NY-BVcNsmXlaoq9sRvzjRV2Ojn7A0Snxpe3nvbkMKkHkKCOZV_DOiiZ6fnMG7DjzOecNUSf6ga_qzpvbZwJb2xcn9CGpPQ19e43WjAXbMssaDK7XikM6-EFy8lbltDuHxyFA_Pp5lxCJFhYKDqpO0T91ReNdsbysicxF42nVNnAnzHgVGFvUDqJiQu77MdOLEZSEkTrqDYCnUCK-9SOlHmzOajOxM_EpFw',
    isFavorite: true,
  },
  {
    id: 'w5',
    name: 'Vanguard Gloves',
    price: 10400, // 85 * 122 rounded
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnr4OkGYYZ_cG_yDO0OS9nsc63Mj-Q2J6FMOk6wKwjRymD-C4QLgFWDFCv0ny5HW5FdWh--wlYYxAWOLa4QE8M7J5IBsAAxbWkl3SNqNu5VIhIZu1kd0UZJYKewCllqe2zqvBhjgRhaEYyjbvAFp8ilTMtpkh2fMPXK5_Vei4u6jRkpMkhx-atFfhzVJL6vhK1DEhlT5l06gKJHDb4PJPuekW1VHunQvZCjCzZkvHXhnYN5yI6kNbC2A',
    isFavorite: true,
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  // Toggle favorite (heart icon remove/add simulation)
  const toggleFavorite = (id: string) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    // Filter out item if user toggles off (or just let them toggle visual fill)
    // The prompt says "heart icon to remove (toggle fill on click)"
    // We will simulate removing the item from the wishlist after a slight delay if they toggle it off,
    // or let them explicitly click to toggle. To keep UX smooth, let's keep the items visible but with outline heart,
    // or remove it. Let's make it remove from the wishlist state list.
    setTimeout(() => {
      setWishlist((prev) => prev.filter((item) => item.id !== id || item.isFavorite));
    }, 400);
  };

  const handleMoveToCart = (item: WishlistItem) => {
    alert(`Moved ${item.name} to cart!`);
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
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
            {wishlist.length === 0 ? (
              <BentoCard className="text-center py-16">
                <Heart className="mx-auto text-outline/30 mb-4" size={48} />
                <h3 className="font-headline-md text-lg text-primary mb-2">Your wishlist is empty</h3>
                <p className="text-sm text-on-surface-variant font-body-md max-w-sm mx-auto mb-6">
                  Add high-performance gear to your wishlist while browsing the shop to save them for later.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-sm tracking-wider uppercase transition-all duration-300"
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
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors duration-200 z-10"
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
                        className="mt-auto w-full bg-secondary text-white py-3 rounded-lg font-label-bold hover:bg-secondary-container transition-colors active:scale-95 duration-200 uppercase tracking-wider text-xs"
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
