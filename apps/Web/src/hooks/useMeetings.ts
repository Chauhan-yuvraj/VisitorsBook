import { useState, useEffect } from 'react';
import { meetingService } from '@/services/meeting.service';
import type { Meeting, CreateMeetingRequest } from '@/types/meeting';

export const useMeetings = (userId?: string) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch meetings for a user
  const fetchMeetings = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.getMeetings(id);
      if (response.success && response.data) {
        setMeetings(response.data);
      } else {
        setError(response.message || 'Failed to fetch meetings');
      }
    } catch (err) {
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  // Create a new meeting
  const createMeeting = async (meetingData: CreateMeetingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.createMeeting(meetingData);
      if (response.success && response.data) {
        setMeetings(prev => [...prev, response.data!]);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create meeting');
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to create meeting');
      return { success: false, message: 'Failed to create meeting' };
    } finally {
      setLoading(false);
    }
  };

  // Update a meeting
  const updateMeeting = async (meetingId: string, meetingData: Partial<CreateMeetingRequest>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.updateMeeting(meetingId, meetingData);
      if (response.success && response.data) {
        setMeetings(prev => prev.map(meeting =>
          meeting._id === meetingId ? response.data! : meeting
        ));
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update meeting');
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to update meeting');
      return { success: false, message: 'Failed to update meeting' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a meeting
  const deleteMeeting = async (meetingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.deleteMeeting(meetingId);
      if (response.success) {
        setMeetings(prev => prev.filter(meeting => meeting._id !== meetingId));
        return { success: true };
      } else {
        setError(response.message || 'Failed to delete meeting');
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to delete meeting');
      return { success: false, message: 'Failed to delete meeting' };
    } finally {
      setLoading(false);
    }
  };

  // Load meetings when userId changes
  useEffect(() => {
    if (userId) {
      fetchMeetings(userId);
    }
  }, [userId]);

  return {
    meetings,
    loading,
    error,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
  };
};