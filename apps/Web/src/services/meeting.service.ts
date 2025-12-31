import type { Meeting, CreateMeetingRequest } from '@/types/meeting';
import api from './api';

export const meetingService = {
  // Create a new meeting
  createMeeting: async (meetingData: CreateMeetingRequest): Promise<{ success: boolean; data?: Meeting; message?: string }> => {
    try {
      const response = await api.post('/meetings', meetingData);
      // Backend returns { success: true, data: meeting, availabilityLogs }
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: 'Failed to create meeting' };
    } catch (error: any) {
      console.error('Error creating meeting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create meeting'
      };
    }
  },

  // Get meetings for a user
  getMeetings: async (userId: string): Promise<{ success: boolean; data?: Meeting[]; message?: string }> => {
    try {
      const response = await api.get(`/meetings/user/${userId}`);
      // Backend returns { success: true, data: meetings }
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: 'No meetings found' };
    } catch (error: any) {
      console.error('Error fetching meetings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meetings'
      };
    }
  },

  // Get meeting by ID
  getMeeting: async (meetingId: string): Promise<{ success: boolean; data?: Meeting; message?: string }> => {
    try {
      const response = await api.get(`/meetings/${meetingId}`);
      // Backend returns { success: true, data: meeting }
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: 'Meeting not found' };
    } catch (error: any) {
      console.error('Error fetching meeting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch meeting'
      };
    }
  },

  // Update meeting
  updateMeeting: async (meetingId: string, meetingData: Partial<CreateMeetingRequest>): Promise<{ success: boolean; data?: Meeting; message?: string }> => {
    try {
      const response = await api.put(`/meetings/${meetingId}`, meetingData);
      // Backend returns { success: true, data: meeting }
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: 'Failed to update meeting' };
    } catch (error: any) {
      console.error('Error updating meeting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update meeting'
      };
    }
  },

  // Delete meeting
  deleteMeeting: async (meetingId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.delete(`/meetings/${meetingId}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete meeting'
      };
    }
  },

  // Get available time slots for scheduling
  getAvailableSlots: async (date: string, duration: number = 30): Promise<{ success: boolean; data?: any[]; message?: string }> => {
    try {
      const response = await api.get(`/meetings/available-slots?date=${date}&duration=${duration}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available slots'
      };
    }
  }
};