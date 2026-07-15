'use client';

import { useState, useEffect, Suspense } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Skeleton } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function ShopPageContent() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSize, setActiveSize] = useState('S');

  // API State
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(5000);
  const [maxPrice, setMaxPrice] = useState<number>(110000);
  const [sortOption, setSortOption] = useState<string>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch categories list dynamically
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCategories(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Listen to URL parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Fetch products from API on param changes
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        
        let url = `/api/products?page=${currentPage}&limit=8`;
        
        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (minPrice !== undefined && minPrice !== null) {
          url += `&minPrice=${minPrice}`;
        }
        if (maxPrice !== undefined && maxPrice !== null) {
          url += `&maxPrice=${maxPrice}`;
        }
        if (sortOption) {
          url += `&sort=${sortOption}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const json = await res.json();
        if (json.success) {
          setProductsList(json.data);
          setTotalPages(json.pagination.totalPages || 1);
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

    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategory, minPrice, maxPrice, sortOption]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? '' : cat));
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let mapped = 'newest';
    if (val === 'Price: Low to High') mapped = 'price-asc';
    else if (val === 'Price: High to Low') mapped = 'price-desc';
    else if (val === 'Most Popular') mapped = 'rating';
    else if (val === 'Oldest') mapped = 'oldest';
    
    setSortOption(mapped);
    setCurrentPage(1);
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              />
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-bold hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
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
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span
                      className={`font-body-md transition-colors ${
                        selectedCategory === cat
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

            {/* Price Range */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-6 tracking-widest">
                Price Range
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant font-label-bold">Min (৳)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-3 py-2.5 text-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    placeholder="5000"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant font-label-bold">Max (৳)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-3 py-2.5 text-sm font-body-md text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    placeholder="110000"
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase mb-4 tracking-widest">
                Sort By
              </h3>
              <select
                onChange={handleSortChange}
                className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body-md focus:ring-2 focus:ring-primary outline-none"
              >
                <option>New Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
                <option>Oldest</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {error ? (
              <div className="text-center py-16 text-error font-body-md bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-2xl">
                {error}
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-12">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <Skeleton className="rounded-xl">
                      <div className="aspect-[3/4] w-full bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-3/4 h-5 rounded-lg" />
                    <Skeleton className="w-1/4 h-4 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : productsList.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <p className="text-on-surface-variant font-body-lg italic">
                  No products match your selected filters. Try broadening your criteria.
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {productsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-20 flex items-center justify-center gap-4">
                    <button
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant hover:border-primary transition-all group disabled:opacity-50 cursor-pointer"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-label-bold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant hover:bg-surface-container-low'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant hover:border-primary transition-all group disabled:opacity-50 cursor-pointer"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 max-w-[1280px] mx-auto px-6 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-on-surface-variant font-label-bold">Loading technical collection...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
