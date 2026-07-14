import React from 'react';
import { CheckCircle, ShieldCheck, Truck, Package } from 'lucide-react';

interface OrderTimelineProps {
  activeStep: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

const STEPS = [
  { id: 'Pending', label: 'Pending', icon: CheckCircle },
  { id: 'Confirmed', label: 'Confirmed', icon: ShieldCheck },
  { id: 'Shipped', label: 'Shipped', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: Package },
];

export default function OrderTimeline({ activeStep }: OrderTimelineProps) {
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  // Calculate width for the progress bar line
  const progressWidth = `${(activeIndex / (STEPS.length - 1)) * 100}%`;

  return (
    <div className="relative w-full py-4">
      {/* Timeline background line */}
      <div className="absolute top-10 left-0 w-full h-1 bg-surface-variant rounded-full -translate-y-1/2 z-0" />

      {/* Timeline active progress line */}
      <div
        className="absolute top-10 left-0 h-1 bg-secondary rounded-full -translate-y-1/2 transition-all duration-500 ease-out z-0"
        style={{ width: progressWidth }}
      />

      {/* Timeline steps */}
      <div className="relative flex justify-between items-start z-10">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;

          let badgeStyles = 'bg-surface-variant text-outline';
          let textStyles = 'text-outline';

          if (isActive) {
            badgeStyles = 'bg-secondary text-on-secondary ring-4 ring-background';
            textStyles = 'text-secondary font-bold';
          } else if (isCompleted) {
            badgeStyles = 'bg-secondary text-on-secondary';
            textStyles = 'text-primary font-semibold';
          }

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${badgeStyles}`}
              >
                <Icon size={22} />
              </div>
              <span className={`mt-3 text-xs md:text-sm font-label-bold text-center transition-all ${textStyles}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
