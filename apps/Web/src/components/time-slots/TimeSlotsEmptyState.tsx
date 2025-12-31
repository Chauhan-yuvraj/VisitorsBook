import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlotsEmptyStateProps {
  className?: string;
}

export const TimeSlotsEmptyState: React.FC<TimeSlotsEmptyStateProps> = ({
  className,
}) => {
  return (
    <div className={cn(
      'text-center py-8 text-muted-foreground',
      className
    )}>
      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p className="text-sm sm:text-base">
        Please select a date from the calendar to view available time slots.
      </p>
    </div>
  );
};