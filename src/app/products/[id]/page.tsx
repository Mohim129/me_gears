'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Star,
  Shield,
  Truck,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
import { products } from '@/data/products';

type TabKey = 'description' | 'reviews' | 'shipping';

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6">
            Product Not Found
          </h1>
          <p className="text-on-surface-variant font-body-lg mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-label-bold hover:bg-primary-container transition-all"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'shipping', label: 'Shipping Info' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 max-w-[1280px] mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-card">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
                priority
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-label-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {product.isLimited && (
                <span className="absolute top-4 left-4 bg-secondary text-on-secondary text-[10px] font-label-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Limited Edition
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-secondary shadow-md'
                      : 'border-transparent hover:border-outline-variant'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badge + Title */}
            <div>
              <p className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="font-headline-xl text-[36px] leading-[44px] font-bold text-primary mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} />
                <span className="text-on-surface-variant font-body-md">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <p className="font-headline-lg text-headline-lg text-primary">
              ৳ {product.price.toLocaleString('en-IN')}
            </p>

            {/* Color Selector */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                Color: <span className="normal-case text-on-surface-variant">{product.colors[selectedColor]?.name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === i
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-outline-variant hover:border-primary'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 border rounded-xl font-label-bold transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant hover:border-primary text-on-surface'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-1 bg-surface-container rounded-xl w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:text-secondary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-label-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:text-secondary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-label-bold text-label-bold tracking-wider flex items-center justify-center gap-3 hover:bg-secondary-container transition-all active:scale-[0.98]">
                <ShoppingCart size={20} />
                ADD TO CART
              </button>
              <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-label-bold text-label-bold tracking-wider flex items-center justify-center gap-3 hover:bg-primary hover:text-on-primary transition-all">
                <Heart size={20} />
                ADD TO WISHLIST
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Shield size={20} className="text-secondary" />
                <span className="text-sm font-label-bold">Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Truck size={20} className="text-secondary" />
                <span className="text-sm font-label-bold">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <RefreshCw size={20} className="text-secondary" />
                <span className="text-sm font-label-bold">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex border-b border-outline-variant/30 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 font-label-bold text-label-bold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-secondary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {product.description}
                </p>
                <div>
                  <h4 className="font-headline-md text-[18px] text-primary font-semibold mb-4">
                    Technical Specifications
                  </h4>
                  <ul className="space-y-3">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="font-headline-xl text-[48px] font-bold text-primary leading-none">
                      {product.rating}
                    </p>
                    <StarRating rating={product.rating} />
                    <p className="text-on-surface-variant text-sm mt-1">{product.reviewCount} reviews</p>
                  </div>
                </div>
                {/* Sample reviews */}
                {[
                  { name: 'Alex T.', rating: 5, text: 'Outstanding quality. The attention to detail is remarkable — every stitch and zipper feels premium. Worth every penny.' },
                  { name: 'Jordan M.', rating: 4, text: 'Great product overall. Fits true to size and the materials are top-notch. Only wish it came in more colors.' },
                  { name: 'Casey R.', rating: 5, text: 'This is my third ME GEARS purchase and they never disappoint. The engineering quality is unmatched.' },
                ].map((review, i) => (
                  <div key={i} className="border-b border-outline-variant/20 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-label-bold text-primary">{review.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }, (_, j) => (
                          <Star key={j} size={14} className="text-secondary fill-secondary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant font-body-md">{review.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-on-surface-variant font-body-md">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-bold text-primary mb-1">Free Standard Shipping</p>
                    <p>Orders over ৳ 11,000 qualify for free standard shipping (5–7 business days).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-bold text-primary mb-1">Express Shipping</p>
                    <p>Available for ৳ 1,650 flat rate (2–3 business days).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-bold text-primary mb-1">Returns & Exchanges</p>
                    <p>Free returns within 30 days. Items must be unworn with original tags attached.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-12">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="simple" />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
