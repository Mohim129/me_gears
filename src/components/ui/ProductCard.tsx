'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'flat' | 'boxed';
  showRating?: boolean;
}

export default function ProductCard({
  product,
  variant = 'flat',
  showRating = false,
}: ProductCardProps) {
  const { name, price, image, isNew, rating, reviewCount } = product;

  // Render Star Ratings
  const renderStars = (ratingVal: number = 0) => {
    return (
      <div className="flex items-center text-secondary mb-2">
        {Array.from({ length: 5 }).map((_, idx) => {
          const isFilled = idx < Math.floor(ratingVal);
          return (
            <Star
              key={idx}
              className={`w-3.5 h-3.5 ${
                isFilled 
                  ? 'fill-secondary text-secondary' 
                  : 'text-outline/40'
              }`}
            />
          );
        })}
        {reviewCount !== undefined && (
          <span className="ml-2 text-on-surface-variant text-[12px] font-label-bold">
            ({reviewCount})
          </span>
        )}
      </div>
    );
  };

  const cardContent = (
    <>
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-container">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Hover Quick Add Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 z-20">
          <button
            className="bg-white text-primary font-label-bold px-6 py-3 shadow-lg hover:bg-secondary hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Added ${name} to cart!`);
            }}
          >
            Quick Add
          </button>
        </div>

        {/* Conditional "New" Badge */}
        {isNew && (
          <span className="absolute top-4 left-4 z-20 bg-secondary text-white text-[10px] px-3 py-1 font-label-bold rounded-full uppercase tracking-wider">
            New
          </span>
        )}
      </div>

      {/* Details Area */}
      {variant === 'boxed' ? (
        <div className="p-6">
          {showRating && rating !== undefined && renderStars(rating)}
          <h4 className="font-headline-md text-[16px] text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
            {name}
          </h4>
          <p className="text-on-surface-variant font-label-bold">৳ {price.toLocaleString('en-IN')}</p>
        </div>
      ) : (
        <div className="mt-4">
          {showRating && rating !== undefined && renderStars(rating)}
          <h4 className="font-headline-md text-[18px] text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
            {name}
          </h4>
          <p className="text-on-surface-variant font-label-bold">৳ {price.toLocaleString('en-IN')}</p>
        </div>
      )}
    </>
  );

  if (variant === 'boxed') {
    return (
      <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      {cardContent}
    </div>
  );
}
