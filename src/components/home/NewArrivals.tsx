'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@heroui/react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const NEW_PRODUCTS: Product[] = [
  {
    id: 'new-1',
    name: 'Apex Technical Shell',
    price: 27000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA44OejF5K1-maX_-xq4_lG1_8eE6S5AgZiqFP4sdT48F8tScfhYUSBBJ25oUXakwGmL2QjS8ZLMiMV1WMPNNXbQPFT8U-pCz8aa87KMQW1zUItzF0za6NdU61zci9N5ffvNbf-o4wf539agtqOD_OFC36XfVypvXMwsjDKpe3urnvZ2-lmtlwHfL3XzO3g9LwIpXgD4aLe7BbAhaOcSmw7qs189B9InfH3DNynWoEvIbziVqCu2jUXBw',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA44OejF5K1-maX_-xq4_lG1_8eE6S5AgZiqFP4sdT48F8tScfhYUSBBJ25oUXakwGmL2QjS8ZLMiMV1WMPNNXbQPFT8U-pCz8aa87KMQW1zUItzF0za6NdU61zci9N5ffvNbf-o4wf539agtqOD_OFC36XfVypvXMwsjDKpe3urnvZ2-lmtlwHfL3XzO3g9LwIpXgD4aLe7BbAhaOcSmw7qs189B9InfH3DNynWoEvIbziVqCu2jUXBw'],
    category: 'men',
    isNew: true,
    isLimited: false,
    description: 'High-performance technical shell jacket.',
    specs: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }],
    rating: 4.8,
    reviewCount: 45,
  },
  {
    id: 'new-2',
    name: 'Modular Cargo Jogger',
    price: 19800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmzdn-C-9uZAkTKjZ667l4d28fBCz8jTVmhRjlTY6FegOfdN0zr8z7eujKf8aNRAQP4Efsbl9P5LQc2g9LCeI4tv2Ko2SCqq3LitHdvaR9t8e4ri-ruNY1r1VxsKI8GHGzLHx5eDKWKplzp-xjLZkkyGVrDqMx_TTksKYuSEIxCpv4fR_wf2ApEcHTMyNc6UxecPXudvWwaE-rGATmqcpVpqneNlVG8fsK31hulNQ6zLrcVwq9R2rahw',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDmzdn-C-9uZAkTKjZ667l4d28fBCz8jTVmhRjlTY6FegOfdN0zr8z7eujKf8aNRAQP4Efsbl9P5LQc2g9LCeI4tv2Ko2SCqq3LitHdvaR9t8e4ri-ruNY1r1VxsKI8GHGzLHx5eDKWKplzp-xjLZkkyGVrDqMx_TTksKYuSEIxCpv4fR_wf2ApEcHTMyNc6UxecPXudvWwaE-rGATmqcpVpqneNlVG8fsK31hulNQ6zLrcVwq9R2rahw'],
    category: 'men',
    isNew: false,
    isLimited: false,
    description: 'Comfortable modular cargo jogger pants.',
    specs: [],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Olive Green', hex: '#556b2f' }],
    rating: 4.6,
    reviewCount: 32,
  },
  {
    id: 'new-3',
    name: 'Structured Wool Blazer',
    price: 34100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT97xE71YCLm82roBPKsxBeYyySs48W-Ys2ksVoLjFvIvmkrOz9glKXOM_qY9HamQn_oRn4VT0z8jg835FqQ9JK_pf8OC0JQoBUVB4hbhZ37OUxJmTE9N6Jgd9humo8PPrsmsOxMzhEiimibWFoiZQUr0JU8ybeYulcY-m-5VdDhRAtsre2b12J00dcRUoew_hrttWMoP_bI5gOf6xpbJMr4j5jt2sfglhy9iluEApbcWqKhffW3W77Q',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAT97xE71YCLm82roBPKsxBeYyySs48W-Ys2ksVoLjFvIvmkrOz9glKXOM_qY9HamQn_oRn4VT0z8jg835FqQ9JK_pf8OC0JQoBUVB4hbhZ37OUxJmTE9N6Jgd9humo8PPrsmsOxMzhEiimibWFoiZQUr0JU8ybeYulcY-m-5VdDhRAtsre2b12J00dcRUoew_hrttWMoP_bI5gOf6xpbJMr4j5jt2sfglhy9iluEApbcWqKhffW3W77Q'],
    category: 'women',
    isNew: false,
    isLimited: false,
    description: 'Structured wool blazer for women.',
    specs: [],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Navy', hex: '#162839' }],
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: 'new-4',
    name: 'Nomad Tech Pack',
    price: 18200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBHdrhZX9nNTz4uJNvjkUVcRCv7RexiiS2LG3wLY6KYcS6QwZK6_KOLvtrEWoXccQi8lpOah6yV8GmDTxaB1MQFtuC1_vz121hA0akbNSpKdDLiHWLI8lxgb_9B6l4YTEnBziJ60hb-pxvpgU9GES3P28ChWg_2Z9g5DyVLHokJzglgLNYO-PsUiilX5OH1Y-B5xB54_s_EUrtOUygoqii_DflvLNE1qT7-VzU1GP75vnoJADBOr-Ihg',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBBHdrhZX9nNTz4uJNvjkUVcRCv7RexiiS2LG3wLY6KYcS6QwZK6_KOLvtrEWoXccQi8lpOah6yV8GmDTxaB1MQFtuC1_vz121hA0akbNSpKdDLiHWLI8lxgb_9B6l4YTEnBziJ60hb-pxvpgU9GES3P28ChWg_2Z9g5DyVLHokJzglgLNYO-PsUiilX5OH1Y-B5xB54_s_EUrtOUygoqii_DflvLNE1qT7-VzU1GP75vnoJADBOr-Ihg'],
    category: 'accessories',
    isNew: false,
    isLimited: false,
    description: 'Comfortable technical backpack.',
    specs: [],
    sizes: ['One Size'],
    colors: [{ name: 'Slate Gray', hex: '#2c3e50' }],
    rating: 4.7,
    reviewCount: 22,
  },
];

export default function NewArrivals() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Simulate API call loading duration
    return () => clearTimeout(timer);
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
            href="#"
            className="font-label-bold text-primary hover:text-secondary transition-colors underline underline-offset-4"
          >
            View All New
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  {/* Skeleton Card Image Area */}
                  <Skeleton className="rounded-xl">
                    <div className="aspect-[3/4] w-full bg-default-200" />
                  </Skeleton>
                  {/* Skeleton Title */}
                  <Skeleton className="w-3/4 h-5 rounded-lg" />
                  {/* Skeleton Price */}
                  <Skeleton className="w-1/4 h-4 rounded-lg" />
                </div>
              ))
            : NEW_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
