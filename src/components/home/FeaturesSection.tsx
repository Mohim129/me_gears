import { CheckCircle, Leaf, Truck, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    rotation: 'rotate-3',
    title: 'Premium Fabrics',
    description: 'Sourced from the finest mills globally for durability and comfort.',
  },
  {
    icon: Leaf,
    rotation: '-rotate-3',
    title: 'Ethically Made',
    description: 'Fair wages and safe conditions across our entire supply chain.',
  },
  {
    icon: Truck,
    rotation: 'rotate-6',
    title: 'Next Day Delivery',
    description: 'Get your gear faster with our optimized logistics network.',
  },
  {
    icon: ShieldCheck,
    rotation: '-rotate-6',
    title: 'Lifetime Guarantee',
    description: 'We stand by our quality. Repairs or replacements for life.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 max-w-[1280px] mx-auto px-6 border-t border-outline/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center group">
              {/* Rotated container */}
              <div 
                className={`w-16 h-16 bg-secondary-fixed mx-auto mb-6 flex items-center justify-center rounded-2xl transform ${feature.rotation} transition-transform duration-300 group-hover:rotate-0 shadow-sm`}
              >
                <Icon className="text-secondary w-8 h-8" />
              </div>
              <h3 className="font-headline-md text-[18px] font-semibold mb-3 text-primary">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant font-body-md text-[16px] max-w-[240px] mx-auto leading-normal">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
