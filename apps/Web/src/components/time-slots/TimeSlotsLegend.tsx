import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegendItem {
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface TimeSlotsLegendProps {
  isEditing?: boolean;
  className?: string;
}

export const TimeSlotsLegend: React.FC<TimeSlotsLegendProps> = ({
  isEditing = false,
  className,
}) => {
  if (isEditing) return null;

  const legendItems: LegendItem[] = [
    {
      icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
      label: 'Available',
      color: 'text-green-500',
    },
    {
      icon: <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
      label: 'Booked',
      color: 'text-red-500',
    },
    {
      icon: <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
      label: 'Unavailable',
      color: 'text-muted-foreground',
    },
    {
      icon: <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
      label: 'Past',
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className={cn(
      'p-3 bg-muted/50 rounded-lg',
      className
    )}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1"
          >
            <span className={item.color}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};