'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Printer, MapPin, CreditCard, Info, ShieldCheck, Mail, Phone, ChevronRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BentoCard from '@/components/ui/BentoCard';
import OrderTimeline from '@/components/ui/OrderTimeline';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from '@heroui/react';

type StepType = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'user';

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/orders/${id}`);
      if (res.status === 404) {
        setOrder(null);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to fetch order details');
      }
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
      } else {
        throw new Error(json.error || 'Failed to retrieve order data');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleStatusUpdate = async (newStatus: StepType) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const json = await res.json();
      if (json.success) {
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        throw new Error(json.error || 'Failed to update order status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getTrackingInfo = (step: string) => {
    switch (step) {
      case 'Pending':
        return 'Your order has been received and is waiting for packing verification. We will process it shortly.';
      case 'Confirmed':
        return 'Your order has been verified and confirmed. It is currently being packed in our main distribution center.';
      case 'Shipped':
        return 'Your package is currently in transit with Express Logistics. Expected delivery: 3-5 business days.';
      case 'Delivered':
        return 'Your order was successfully delivered and signed for.';
      default:
        return 'Order processing.';
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-6 space-y-12">
          <Skeleton className="w-1/3 h-6 rounded-lg" />
          <div className="h-40 w-full bg-surface-container animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-48 w-full bg-surface-container animate-pulse rounded-2xl" />
            <div className="h-48 w-full bg-surface-container animate-pulse rounded-2xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6">
            {error ? 'An Error Occurred' : 'Order Not Found'}
          </h1>
          <p className="text-on-surface-variant font-body-lg mb-8">
            {error || 'The order you are requesting does not exist.'}
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-label-bold hover:bg-primary-container transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const items = order.items || [];
  const subtotal = order.amount || 0;
  const shipping = 0; // Free Standard Shipping
  const tax = Math.round((subtotal * 0.08) / 10) * 10;
  const total = subtotal + shipping + tax;
  const displayId = order.id.substring(order.id.length - 8).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {/* Header & Order Meta */}
        <div className="mb-12">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4 font-bold">Order Details</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Orders', href: '/orders' },
                  { label: `#${displayId}` },
                ]}
              />
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Order <span className="font-bold text-primary">#{displayId}</span> • Placed on{' '}
                <span className="font-bold text-primary">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </span>
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-lowest hover:bg-surface-container border border-outline/10 rounded-xl font-label-bold text-label-bold text-primary transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Demo Controller: Allows toggling status dynamically */}
        <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-label-bold text-primary uppercase tracking-wider">
            {userRole === 'admin' ? 'Change Order Status (Admin):' : 'Order Status simulation:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {(['Pending', 'Confirmed', 'Shipped', 'Delivered'] as StepType[]).map((step) => (
              <button
                key={step}
                disabled={updating}
                onClick={() => handleStatusUpdate(step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-bold transition-all cursor-pointer ${
                  order.status === step
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-white hover:bg-surface-container text-on-surface-variant border border-outline/10'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Order Status Timeline */}
        <BentoCard className="mb-8">
          <OrderTimeline activeStep={['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(order.status) ? order.status : 'Pending'} />

          <div className="mt-10 p-6 bg-surface-container-low rounded-lg border border-outline/5 flex items-start gap-4">
            <Info className="text-secondary shrink-0 mt-0.5" size={20} />
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {getTrackingInfo(order.status)}
            </p>
          </div>
        </BentoCard>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Address */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-primary" size={24} />
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Shipping Address</h2>
            </div>
            <div className="space-y-2">
              <p className="font-label-bold text-label-bold text-primary">{order.shippingAddress?.fullName || order.customer}</p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
              </p>
              {order.shippingAddress?.phone && (
                <p className="pt-4 font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="font-bold">Phone:</span> {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </BentoCard>

          {/* Payment Method */}
          <BentoCard>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-primary" size={24} />
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Payment Method</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                <CreditCard className="text-secondary shrink-0" size={24} />
                <div>
                  <p className="font-label-bold text-label-bold text-primary">{order.paymentMethod || 'Cash on Delivery'}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Pay when your order arrives</p>
                </div>
              </div>
              <div className="pt-2 border-t border-outline/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-label-bold text-primary">৳ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md text-on-surface-variant">Shipping</span>
                  <span className="font-label-bold text-primary">Free</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline/10">
                  <span className="font-headline-md text-headline-md text-primary">Total</span>
                  <span className="font-headline-md text-headline-md text-secondary">৳ {total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Order Items */}
        <BentoCard className="overflow-hidden p-0 md:p-0">
          <div className="p-8 border-b border-outline/10">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">Order Summary</h2>
          </div>
          <div className="divide-y divide-outline/10">
            {items.map((item: any, index: number) => (
              <div key={index} className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:bg-surface-container-low/30 transition-colors">
                <div className="relative w-full sm:w-32 aspect-[3/4] bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 128px"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors cursor-pointer">
                      {item.name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Color: {item.color} | Size: {item.size}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="font-body-md text-on-surface-variant">Qty: {item.quantity}</span>
                    <span className="font-label-bold text-headline-md text-primary">৳ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-surface-container-low/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-outline" size={24} />
              <p className="font-body-md text-body-md text-on-surface-variant">30-Day Easy Returns Policy Applied</p>
            </div>
            <button className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary font-label-bold text-label-bold rounded-lg transition-all duration-300 active:scale-95 shadow-sm cursor-pointer">
              Track via SMS
            </button>
          </div>
        </BentoCard>
      </main>

      <Footer />
    </div>
  );
}
