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
import type { Meeting } from "@repo/types";

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
    departments,
    conflicts,
    showConflictsModal,
    handleInputChange,
    handleSelectChange,
    handleParticipantToggle,
    handleDepartmentToggle,
    handleSlotSelect,
    handleNext,
    handleBack,
    handleSubmit,

    handleCancelConflicts,
  } = useMeetingWizard({ isOpen, meetingToEdit });

  const handleConfirmSubmit = async () => {
    const result = await handleSubmit();
    if (result?.hasConflicts) {
      // Conflicts modal will be shown, don't close yet
      return;
    } else if (result?.success) {
      onClose();
    } else {
      alert(result?.message || "Failed to save meeting");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={meetingToEdit ? "Edit Meeting" : "Schedule Meeting"}
      >
        <div className="space-y-6">
          {/* Progress Indicator */}
          <MeetingWizardProgress currentStep={currentStep} />

          {/* Step Content */}
          <div className="min-h-96">
            {currentStep === 1 && (
              <StepHostParticipants
                formData={formData}
                employees={employees}
                departments={departments}
                onHostChange={(value) => handleSelectChange("hostId", value)}
                onParticipantToggle={handleParticipantToggle}
                onDepartmentToggle={handleDepartmentToggle}
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
                departments={departments}
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

      {/* Conflicts Modal */}
      {showConflictsModal && (
        <Modal
          isOpen={showConflictsModal}
          onClose={handleCancelConflicts}
          title="Participant Conflicts"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The following participants have scheduling conflicts. You can
              still create the meeting, but they may not be available.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md bg-yellow-50 border-yellow-200"
                >
                  <div className="font-medium text-yellow-800">
                    {conflict.userName}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {conflict.reason}
                  </div>
                  {conflict.conflictingMeeting && (
                    <div className="text-xs text-yellow-600 mt-1">
                      Conflicting: {conflict.conflictingMeeting.title}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelConflicts}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
