'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import StarRating from '@/components/StarRating';
import { useSession } from '@/lib/auth-client';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'simple';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <Link href={`/products/${product.id}`} className="product-card group cursor-pointer block">
      <div className="relative overflow-hidden rounded-xl aspect-3/4 mb-4 bg-surface-container-lowest shadow-sm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-on-primary text-[10px] font-label-bold uppercase tracking-widest px-3 py-1 rounded-full">
              New Arrival
            </span>
          </div>
        )}
        {product.isLimited && (
          <div className="absolute top-4 left-4">
            <span className="bg-secondary text-on-secondary text-[10px] font-label-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Limited
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-4 right-4">
            <span className="bg-rose-600 text-white text-[10px] font-label-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Add to Cart button */}
        {!isAdmin && (
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isOutOfStock) return;

              try {
                if (!session?.user) {
                  alert('Please log in to add items to cart.');
                  return;
                }

                const res = await fetch('/api/cart', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });

                const json = await res.json();
                if (!res.ok || !json.success) {
                  throw new Error(json.error || 'Failed to add to cart');
                }

                window.dispatchEvent(new Event('cart-updated'));
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to add to cart';
                alert(message);
              }
            }}
            className={`absolute bottom-4 left-4 right-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              isOutOfStock
                ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed opacity-90 translate-y-0'
                : 'cart-btn bg-secondary text-on-secondary hover:bg-secondary-container opacity-0 translate-y-4'
            }`}
          >
            {isOutOfStock ? (
              <span className="font-label-bold">Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span className="font-label-bold">Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-headline-md text-[18px] text-primary group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          {variant === 'default' && (
            <div className="flex items-center gap-1 text-secondary">
              <StarRating rating={1} max={1} />
              <span className="text-label-bold">{product.rating}</span>
            </div>
          )}
        </div>
        <p className="text-on-surface-variant font-body-md">৳ {product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
