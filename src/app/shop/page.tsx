'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const CATEGORIES = ['Outerwear', 'Performance Tops', 'Tactical Bottoms', 'Footwear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLOR_SWATCHES = [
  { label: 'Primary', hex: '#162839', active: true },
  { label: 'Slate Gray', hex: '#2c3e50', active: false },
  { label: 'Rust', hex: '#a23f00', active: false },
  { label: 'Surface', hex: '#d8e5e6', active: false },
  { label: 'Charcoal', hex: '#474744', active: false },
];

export default function ShopPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSize, setActiveSize] = useState('S');
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Shop All</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              High-performance engineering meets industrial aesthetics. Discover our latest
              technical apparel and tactical gear collection.
            </p>
          </div>
          {/* Search & Filter Controls */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <input
                className="w-full bg-surface-container-low border-0 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary placeholder:text-outline-variant font-body-md transition-all outline-none"
                placeholder="Search technical gear..."
                type="text"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              />
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-bold hover:bg-primary-container transition-all active:scale-95"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </header>

        <div className="flex gap-12 relative">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? 'block' : 'hidden'
            } lg:block w-64 flex-shrink-0 space-y-10 sticky top-32 h-fit`}
          >
            {/* Categories */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-6 tracking-widest">
                Categories
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat, i) => (
                  <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={i === 2}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span
                      className={`font-body-md transition-colors ${
                        i === 2
                          ? 'text-primary font-medium'
                          : 'text-on-surface-variant group-hover:text-primary'
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-6 tracking-widest">
                Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setActiveSize(size)}
                    className={`py-2 border rounded-lg font-label-bold transition-all ${
                      activeSize === size
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-6 tracking-widest">
                Colors
              </h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_SWATCHES.map((swatch, i) => (
                  <button
                    key={swatch.label}
                    onClick={() => setActiveColorIdx(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      activeColorIdx === i
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-outline-variant'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={swatch.label}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-6 tracking-widest">
                Price Range
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  className="w-full accent-primary bg-surface-variant h-1 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between font-label-bold text-outline">
                  <span>৳ 0</span>
                  <span>৳ 1,10,000+</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-4 tracking-widest">
                Sort By
              </h3>
              <select className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body-md focus:ring-2 focus:ring-primary outline-none">
                <option>New Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-center gap-4">
              <button
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant hover:border-primary transition-all group disabled:opacity-50"
                disabled
              >
                <ChevronLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div className="flex items-center gap-2">
                <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-on-primary font-label-bold">
                  1
                </button>
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low font-label-bold transition-all"
                  >
                    {n}
                  </button>
                ))}
                <span className="text-outline mx-1">...</span>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low font-label-bold transition-all">
                  12
                </button>
              </div>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant hover:border-primary transition-all group">
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
