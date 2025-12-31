import type { Meeting, CreateMeetingRequest } from '@/types/meeting';
import api from './api';

export const meetingService = {
  // Create a new meeting
  createMeeting: async (meetingData: CreateMeetingRequest): Promise<{ success: boolean; data?: Meeting; message?: string }> => {
    try {
      const response = await api.post('/meetings', meetingData);
      return { success: true, data: response.data };
    } catch (error: any) {
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
      return { success: true, data: response.data };
    } catch (error: any) {
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
      return { success: true, data: response.data };
    } catch (error: any) {
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
      return { success: true, data: response.data };
    } catch (error: any) {
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