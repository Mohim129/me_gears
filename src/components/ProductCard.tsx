'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import StarRating from '@/components/StarRating';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'simple';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="product-card group cursor-pointer block">
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 bg-surface-container-lowest shadow-sm">
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

        {/* Hover Add to Cart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="cart-btn opacity-0 translate-y-4 absolute bottom-4 left-4 right-4 bg-secondary text-on-secondary py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary-container"
        >
          <ShoppingCart size={18} />
          <span className="font-label-bold">Add to Cart</span>
        </button>
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
