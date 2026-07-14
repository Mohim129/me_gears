import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-label-bold">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} className="text-outline" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
