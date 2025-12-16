import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateVisitThunk } from '@/store/slices/visit.slice';
import { saveRecord } from '@/store/slices/records.slice';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export function useFeedbackSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedVisit } = useSelector((state: RootState) => state.visits);

  const submitFeedback = async (
    feedbackText: string,
    audioUri: string | null,
    imageUris: string[]
  ) => {
    if (!feedbackText && !audioUri) {
      Alert.alert(
        "Action Required",
        "Please provide either text feedback or an audio recording."
      );
      return;
    }

    if (selectedVisit) {
      setIsSubmitting(true);
      try {
        await dispatch(
          updateVisitThunk({
            id: selectedVisit._id,
            payload: {
              status: "CHECKED_OUT",
              feedback: {
                comment: feedbackText || "Audio Feedback Provided",
                rating: 5,
              },
            },
          })
        ).unwrap();

        await dispatch(
          saveRecord({
            guestData: {
              guestName: selectedVisit.visitor.name,
              guestEmail: selectedVisit.visitor.email,
              guestCompany: selectedVisit.visitor.company,
              guestImgUri: selectedVisit.visitor.profileImgUri,
            },
            canvasPages: [],
            signaturePaths: [],
            visitType: selectedVisit.purpose || "General",
            feedbackText: feedbackText,
            audio: audioUri || undefined,
            images: imageUris,
          })
        ).unwrap();

        Alert.alert("Success", "Thank you for your feedback!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } catch (error) {
        console.error("Submission failed:", error);
        Alert.alert("Error", "Failed to submit feedback. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert("Error", "No active visit found.");
      router.replace("/");
    }
  };

  return { isSubmitting, submitFeedback };
}
