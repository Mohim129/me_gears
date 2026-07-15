'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@heroui/react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const BEST_PRODUCTS: Product[] = [
  {
    id: 'best-1',
    name: 'Heavy Crewneck Black',
    price: 10500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhgLtNPnuJ5Ij5DLxQuMjV0LKopMSYigEsIHCQDRbWGouNf5d_qukHJnuRFAYnyQSAri3TkdiJAgfUOedWBq_KC5k6XeGt7BmBSmjwM3itJT3sd2ohqYWisioB-SpEaRaS2RvFkHxqmh2vod07VC18G4qoAawBaZ5ss8guPtqZ-9hk6a1DziAM3yQowp7guoJ3NAodcKifXIiCjq2dXa0YBu0HkPQ78JAsLA2oZG4hPKDzcWY0bdEUwg',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBhgLtNPnuJ5Ij5DLxQuMjV0LKopMSYigEsIHCQDRbWGouNf5d_qukHJnuRFAYnyQSAri3TkdiJAgfUOedWBq_KC5k6XeGt7BmBSmjwM3itJT3sd2ohqYWisioB-SpEaRaS2RvFkHxqmh2vod07VC18G4qoAawBaZ5ss8guPtqZ-9hk6a1DziAM3yQowp7guoJ3NAodcKifXIiCjq2dXa0YBu0HkPQ78JAsLA2oZG4hPKDzcWY0bdEUwg'],
    category: 'men',
    rating: 5,
    reviewCount: 124,
    isNew: false,
    isLimited: false,
    description: 'Heavyweight crewneck sweater in black.',
    specs: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }],
  },
  {
    id: 'best-2',
    name: 'Raw Indigo Selvedge',
    price: 17600,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvwWdz3WHZDPcpfbuMRMVcCki38QUn9nnz0trlQrsol1gwHrTxsGnHr_sPLoj_IdJEf9f3wDT80EmcMcF0T4HBve1n2jSQs2Ywy5E22yq6QP1Tma8NxZNYZEoGuxMbJTtUtJEYEf1ndNzeijBtz4X0_IzQZBWuxY9jdjFxzmPtl2uio2YViEeFvbq8tzHv3D4-YCX29_fuAllUOdl70sbH1m9_K5yYnFle32wTNrd-szwOqLJjzch5og',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCvwWdz3WHZDPcpfbuMRMVcCki38QUn9nnz0trlQrsol1gwHrTxsGnHr_sPLoj_IdJEf9f3wDT80EmcMcF0T4HBve1n2jSQs2Ywy5E22yq6QP1Tma8NxZNYZEoGuxMbJTtUtJEYEf1ndNzeijBtz4X0_IzQZBWuxY9jdjFxzmPtl2uio2YViEeFvbq8tzHv3D4-YCX29_fuAllUOdl70sbH1m9_K5yYnFle32wTNrd-szwOqLJjzch5og'],
    category: 'men',
    rating: 4,
    reviewCount: 98,
    isNew: false,
    isLimited: false,
    description: 'Raw indigo selvedge denim jeans.',
    specs: [],
    sizes: ['30', '32', '34'],
    colors: [{ name: 'Indigo', hex: '#000080' }],
  },
  {
    id: 'best-3',
    name: 'Rib-Knit Bodysuit',
    price: 8300,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJY5eH6oZQjSreygBfkqYOYMQDeWh8fxFgZqU99WvNTmK9ybYGmjCJMufOTVqe9BsdTKNghLD3yMEvTfEkyFiMNKI9gr7w8YN2vsAjtyEShLOW4Egumbipk9uoVk6FkoN99MTjlpWa8pLPNJN2-wmSKDi4WURdZsAMSwTaHdffy9xIaUI48zcgNzRA6mGHOX5QUmy8UOSdX07eKM6G1AUd3DH-G7atKwtMv73C99DEQRCmR4B2DX_xUg',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDJY5eH6oZQjSreygBfkqYOYMQDeWh8fxFgZqU99WvNTmK9ybYGmjCJMufOTVqe9BsdTKNghLD3yMEvTfEkyFiMNKI9gr7w8YN2vsAjtyEShLOW4Egumbipk9uoVk6FkoN99MTjlpWa8pLPNJN2-wmSKDi4WURdZsAMSwTaHdffy9xIaUI48zcgNzRA6mGHOX5QUmy8UOSdX07eKM6G1AUd3DH-G7atKwtMv73C99DEQRCmR4B2DX_xUg'],
    category: 'women',
    rating: 5,
    reviewCount: 215,
    isNew: false,
    isLimited: false,
    description: 'Rib-knit bodysuit for women.',
    specs: [],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Off-White', hex: '#fdfbf7' }],
  },
  {
    id: 'best-4',
    name: 'Void Geometric Shades',
    price: 24200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHiUQwOcdAS63iBDQxiTvOzS5Klod7gbhA_-o91Qe5ALf5JVfvLeoIgdQpa5D3EpPjGvoPe0HFeKknuj8FpLLRCVYphIIJYdutNicWPEKXxPWuflruh8DSvsKcHMrkRvqo0WKCrvr37mgA5LLtEjsP5Bk2yn5oG4Ux9tAgTC0Hi3g84A8zbyYRdIw1eC486_ZTkFPGpTPL4K2o8OWtD-c_NG7h_l2VtDSwqrbH426-WdaD8Ey_c9B_aA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAHiUQwOcdAS63iBDQxiTvOzS5Klod7gbhA_-o91Qe5ALf5JVfvLeoIgdQpa5D3EpPjGvoPe0HFeKknuj8FpLLRCVYphIIJYdutNicWPEKXxPWuflruh8DSvsKcHMrkRvqo0WKCrvr37mgA5LLtEjsP5Bk2yn5oG4Ux9tAgTC0Hi3g84A8zbyYRdIw1eC486_ZTkFPGpTPL4K2o8OWtD-c_NG7h_l2VtDSwqrbH426-WdaD8Ey_c9B_aA'],
    category: 'accessories',
    rating: 4,
    reviewCount: 87,
    isNew: false,
    isLimited: true,
    description: 'Void geometric sunglasses with UV protection.',
    specs: [],
    sizes: ['One Size'],
    colors: [{ name: 'Matte Black', hex: '#000000' }],
  },
];

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/products?sort=oldest&limit=4');
        if (!res.ok) {
          throw new Error('Failed to fetch most wanted gear');
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
    fetchBestSellers();
  }, []);

  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-headline-lg text-[32px] font-bold mb-12 text-center text-primary">
          Most Wanted
        </h2>

        {error ? (
          <div className="text-center py-8 text-error font-body-md bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-xl">
            {error}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className="flex flex-col bg-white rounded-xl overflow-hidden shadow-card p-0 border border-outline/5"
              >
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-6 flex flex-col gap-3">
                  <Skeleton className="w-1/2 h-3.5 rounded-lg" />
                  <Skeleton className="w-3/4 h-5 rounded-lg" />
                  <Skeleton className="w-1/4 h-4 rounded-lg" />
                </div>
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
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
