import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.round(rating)
              ? 'text-secondary fill-secondary'
              : 'text-outline-variant'
          }
        />
      ))}
    </div>
  );
}
