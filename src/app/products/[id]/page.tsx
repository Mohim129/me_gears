'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Product } from '@/types';
import { Skeleton } from '@heroui/react';
import { useSession } from '@/lib/auth-client';

type TabKey = 'description' | 'reviews' | 'shipping';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'user';
  const isAdmin = userRole === 'admin';

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  
  // Action Feedback States
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [myReview, setMyReview] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const isOutOfStock = !product?.stock || product.stock <= 0;

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) {
          setProduct(null);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load product');
        }
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
          if (json.data.sizes && json.data.sizes.length > 0) {
            setSelectedSize(json.data.sizes[0]);
          }
          
          // Fetch related products of the same category
          try {
            const relRes = await fetch(`/api/products?category=${encodeURIComponent(json.data.category)}&limit=5`);
            if (relRes.ok) {
              const relJson = await relRes.json();
              if (relJson.success) {
                // Filter out the current product
                const filtered = relJson.data.filter((p: Product) => p.id !== json.data.id).slice(0, 4);
                setRelatedProducts(filtered);
              }
            }
          } catch (relErr) {
            console.error('Error fetching related products:', relErr);
          }
        } else {
          throw new Error(json.error || 'Failed to fetch product data');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      if (!id) return;
      try {
        setReviewLoading(true);
        const res = await fetch(`/api/products/${id}/reviews`);
        if (!res.ok) throw new Error('Failed to load reviews');
        const json = await res.json();
        if (json.success) {
          setReviews(json.data.reviews || []);
          setMyReview(json.data.myReview || null);
          setHasPurchased(Boolean(json.data.hasPurchased));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReviewLoading(false);
      }
    }

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setReviewSubmitting(true);
    setReviewError(null);
    try {
      const endpoint = isEditingReview && myReview?.id
        ? `/api/reviews/${myReview.id}`
        : `/api/products/${id}/reviews`;
      const method = isEditingReview && myReview?.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit review');
      }
      const nextReview = isEditingReview && myReview?.id ? { ...myReview, ...reviewForm } : json.data;
      setMyReview(nextReview);
      setReviews((prev) => {
        if (isEditingReview && myReview?.id) {
          return prev.map((review) => (review.id === myReview.id ? nextReview : review));
        }
        return [json.data, ...prev];
      });
      setReviewForm({ rating: 5, comment: '' });
      setIsEditingReview(false);
    } catch (err: any) {
      setReviewError(err.message || 'Unable to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!myReview?.id) return;
    try {
      const res = await fetch(`/api/reviews/${myReview.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete review');
      setMyReview(null);
      setReviews((prev) => prev.filter((review) => review.id !== myReview.id));
      setIsEditingReview(false);
    } catch (err: any) {
      setReviewError(err.message || 'Unable to delete review');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    setCartSuccess(false);
    
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size: selectedSize,
          color: product.colors[selectedColor]?.name || '',
        }),
      });

      if (res.status === 401) {
        // Redirect to login if unauthorized
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Could not add item to cart');
      }

      const json = await res.json();
      if (json.success) {
        setCartSuccess(true);
        // Refresh Navbar cart badges by triggering a custom window event
        window.dispatchEvent(new Event('cart-updated'));
        setTimeout(() => setCartSuccess(false), 2000);
      } else {
        throw new Error(json.error || 'Failed to update cart');
      }
    } catch (err: any) {
      alert(err.message || 'Error adding item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    setIsAddingToWishlist(true);
    setWishlistSuccess(false);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Could not add to wishlist');
      }

      const json = await res.json();
      if (json.success) {
        setWishlistSuccess(true);
        window.dispatchEvent(new Event('wishlist-updated'));
        setTimeout(() => setWishlistSuccess(false), 2000);
      } else {
        throw new Error(json.error || 'Failed to update wishlist');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating wishlist.');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 max-w-[1280px] mx-auto px-6 space-y-12">
          <Skeleton className="w-1/3 h-6 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-3/4 w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="w-1/4 h-4 rounded-lg" />
              <Skeleton className="w-3/4 h-10 rounded-lg" />
              <Skeleton className="w-1/2 h-8 rounded-lg" />
              <Skeleton className="w-full h-24 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="w-24 h-12 rounded-xl" />
                <Skeleton className="w-24 h-12 rounded-xl" />
              </div>
              <Skeleton className="w-full h-14 rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6">
            {error ? 'An Error Occurred' : 'Product Not Found'}
          </h1>
          <p className="text-on-surface-variant font-body-lg mb-8">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-label-bold hover:bg-primary-container transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

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
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-surface-container-lowest shadow-card">
              <Image
                src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
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
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
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
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badge + Title */}
            <div>
              <p className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="font-headline-xl text-[36px] leading-11 font-bold text-primary mb-3">
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
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                  Color: <span className="normal-case text-on-surface-variant">{product.colors[selectedColor]?.name}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
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
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 border rounded-xl font-label-bold transition-all cursor-pointer ${
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
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-label-bold text-label-bold text-primary uppercase tracking-widest mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-1 bg-surface-container rounded-xl w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:text-secondary transition-colors cursor-pointer"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-label-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:text-secondary transition-colors cursor-pointer"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="mt-3 text-sm font-label-bold text-on-surface-variant">
                {isOutOfStock ? 'Out of Stock' : `Only ${product.stock} left in stock`}
              </p>
            </div>

            {/* Action Buttons */}
            {!isAdmin && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isOutOfStock}
                  className={`w-full py-4 rounded-xl font-label-bold text-label-bold tracking-wider flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${
                    isOutOfStock
                      ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed'
                      : cartSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-secondary text-on-secondary hover:bg-secondary-container'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {isOutOfStock
                    ? 'OUT OF STOCK'
                    : isAddingToCart
                    ? 'ADDING...'
                    : cartSuccess
                    ? 'ADDED TO CART!'
                    : 'ADD TO CART'}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  className={`w-full border-2 py-4 rounded-xl font-label-bold text-label-bold tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer ${
                    wishlistSuccess
                      ? 'border-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                      : 'border-primary text-primary hover:bg-primary hover:text-on-primary'
                  }`}
                >
                  <Heart size={20} className={wishlistSuccess ? 'fill-emerald-600' : ''} />
                  {isAddingToWishlist ? 'SAVING...' : wishlistSuccess ? 'ADDED TO WISHLIST!' : 'ADD TO WISHLIST'}
                </button>
              </div>
            )}

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
                className={`px-6 py-4 font-label-bold text-label-bold transition-all border-b-2 cursor-pointer ${
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
                {product.specs && product.specs.length > 0 && (
                  <div>
                    <h4 className="font-headline-md text-[18px] text-primary font-semibold mb-4">
                      Technical Specifications
                    </h4>
                    <ul className="space-y-3">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

                {!session ? (
                  <p className="text-on-surface-variant">Log in to leave a review after purchasing this item.</p>
                ) : myReview ? (
                  <div className="rounded-2xl border border-outline-variant/30 p-5 bg-surface-container-low">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-label-bold text-primary">Your Review</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingReview(true);
                            setReviewForm({ rating: myReview.rating, comment: myReview.comment });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-label-bold text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleReviewDelete}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-sm font-label-bold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: myReview.rating }, (_, idx) => (
                        <Star key={idx} size={14} className="text-secondary fill-secondary" />
                      ))}
                    </div>
                    <p className="text-on-surface-variant font-body-md">{myReview.comment}</p>
                  </div>
                ) : hasPurchased ? (
                  <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-outline-variant/30 p-5 bg-surface-container-low space-y-4">
                    {reviewError && <p className="text-sm text-rose-600">{reviewError}</p>}
                    <div>
                      <label className="block text-xs font-label-bold uppercase tracking-wider text-on-surface-variant mb-2">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full rounded-xl border border-outline-variant/30 bg-background px-3 py-2"
                      >
                        {[5,4,3,2,1].map((value) => (
                          <option key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-label-bold uppercase tracking-wider text-on-surface-variant mb-2">Review</label>
                      <textarea
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full rounded-xl border border-outline-variant/30 bg-background px-3 py-2"
                        placeholder="Share your experience"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-bold"
                    >
                      {reviewSubmitting ? 'Submitting...' : isEditingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="text-on-surface-variant">Purchase this item to leave a review.</p>
                )}

                {reviewLoading ? (
                  <p className="text-on-surface-variant">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-on-surface-variant">No reviews yet. Be the first to share your experience.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-outline-variant/20 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-label-bold text-primary">{review.userName || 'Customer'}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }, (_, j) => (
                            <Star key={j} size={14} className="text-secondary fill-secondary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-on-surface-variant font-body-md">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-on-surface-variant font-body-md">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label-bold text-primary mb-1">Free Standard Shipping</p>
                    <p>Orders over ৳ 11,000 qualify for free standard shipping (5–7 business days).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label-bold text-primary mb-1">Express Shipping</p>
                    <p>Available for ৳ 1,650 flat rate (2–3 business days).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw size={20} className="text-secondary mt-0.5 shrink-0" />
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
        {relatedProducts.length > 0 && (
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
        )}
      </main>
      <Footer />
    </>
  );
}
