import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useMeetingWizard } from "@/hooks/useMeetingWizard";
import { MeetingWizardProgress } from "./MeetingWizardProgress";
import {
  StepHostParticipants,
  StepMeetingDetails,
  StepMeetingTypeLocation,
  StepDateSelection,
  StepTimeSlots,
  StepReviewConfirm,
} from "./steps";
import type { Meeting } from "@/types/meeting";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingToEdit?: Meeting | null;
}

export default function MeetingModal({
  isOpen,
  onClose,
  meetingToEdit,
}: MeetingModalProps) {
  const {
    currentStep,
    isLoading,
    selectedDate,
    setSelectedDate,
    selectedSlots,
    formData,
    isCurrentStepValid,
    user,
    employees,
    handleInputChange,
    handleSelectChange,
    handleParticipantToggle,
    handleSlotSelect,
    handleNext,
    handleBack,
    handleSubmit,
  } = useMeetingWizard({ isOpen, meetingToEdit });

  const handleConfirmSubmit = async () => {
    const result = await handleSubmit();
    if (result?.success) {
      onClose();
    } else {
      alert(result?.message || "Failed to save meeting");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meetingToEdit ? "Edit Meeting" : "Schedule Meeting"}>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <MeetingWizardProgress currentStep={currentStep} />

        {/* Step Content */}
        <div className="min-h-96">
          {currentStep === 1 && (
            <StepHostParticipants
              formData={formData}
              employees={employees}
              onHostChange={(value) => handleSelectChange("hostId", value)}
              onParticipantToggle={handleParticipantToggle}
            />
          )}

          {currentStep === 2 && (
            <StepMeetingDetails
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 3 && (
            <StepMeetingTypeLocation
              formData={formData}
              onSelectChange={handleSelectChange}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 4 && (
            <StepDateSelection
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}

          {currentStep === 5 && (
            <StepTimeSlots
              selectedDate={selectedDate}
              selectedSlots={selectedSlots}
              onSlotSelect={handleSlotSelect}
            />
          )}

          {currentStep === 6 && (
            <StepReviewConfirm
              formData={formData}
              selectedDate={selectedDate}
              selectedSlots={selectedSlots}
              employees={employees}
              user={user}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="flex space-x-2">
            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Creating Meeting..." : "Confirm & Schedule"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}