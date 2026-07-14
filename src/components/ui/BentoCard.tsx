import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

export default function BentoCard({ children, className = '' }: BentoCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline/10 shadow-card p-6 md:p-8 rounded-xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
