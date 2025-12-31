import React from 'react';
import type { MeetingWizardStep } from '@/constants/meetingWizard';

interface MeetingWizardProgressProps {
  currentStep: MeetingWizardStep;
}

export const MeetingWizardProgress: React.FC<MeetingWizardProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Host & Participants" },
    { number: 2, title: "Meeting Details" },
    { number: 3, title: "Meeting Type & Location" },
    { number: 4, title: "Date & Time Slots" },
    { number: 5, title: "Review & Confirm" },
  ] as const;

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step.number < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.number === currentStep
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.number}
            </div>
            <span className={`text-xs mt-2 text-center max-w-20 leading-tight ${
              step.number === currentStep ? "font-medium text-foreground" : "text-muted-foreground"
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-colors ${
                step.number < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};