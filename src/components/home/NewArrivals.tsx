'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@heroui/react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/products?sort=newest&limit=4');
        if (!res.ok) {
          throw new Error('Failed to fetch new arrivals');
        }
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        } else {
          throw new Error(json.error || 'Failed to load products');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <section className="py-20 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline-lg text-[32px] font-bold text-primary">New Arrivals</h2>
            <p className="text-on-surface-variant font-body-md mt-2">
              Precision engineered for the modern nomad.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="font-label-bold text-primary hover:text-secondary transition-colors underline underline-offset-4"
          >
            View All New
          </Link>
        </div>

        {error ? (
          <div className="text-center py-8 text-error font-body-md bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-xl">
            {error}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <Skeleton className="rounded-xl">
                  <div className="aspect-[3/4] w-full bg-default-200" />
                </Skeleton>
                <Skeleton className="w-3/4 h-5 rounded-lg" />
                <Skeleton className="w-1/4 h-4 rounded-lg" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant font-body-md italic bg-surface-container-low rounded-xl border border-outline/5">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
