import { Request, Response } from "express";
import { MeetingService } from "../services/meeting.service";
import { Meeting } from "../models/meeting.model";
import { Availability } from "../models/availability.model";
import { ROLE_PERMISSIONS, UserRole } from "@repo/types";
import mongoose from "mongoose";

export class MeetingController {
  // Get all meetings with permission-based filtering
  static async getAllMeetings(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userPermissions = ROLE_PERMISSIONS[user?.role as UserRole] || [];

      let query: any = { status: { $ne: "cancelled" } };

      // Filter based on permissions and meeting scope
      if (userPermissions.includes("view_all_meetings")) {
        // Admin and HR can see all meetings
        query = { status: { $ne: "cancelled" } };
      } else if (userPermissions.includes("view_department_meetings")) {
        // Managers and employees can see meetings based on scope
        query = {
          status: { $ne: "cancelled" },
          $or: [
            { scope: "general" }, // All general meetings
            {
              scope: "departments",
              departments: { $in: user.departments || [] },
            }, // Department-specific meetings
            // Note: 'separate' meetings are only visible to admins/HR
          ],
        };
      } else {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view meetings",
        });
      }

      const meetings = await Meeting.find(query)
        .populate("organizer", "name email departments")
        .populate("host", "name email departments")
        .populate("participants", "name email departments")
        .populate("departments", "departmentName")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: meetings,
      });
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch meetings",
      });
    }
  }

  // Create a new meeting
  static async createMeeting(req: Request, res: Response) {
    try {
      const {
        organizer,
        host,
        participants,
        scope,
        departments,
        title,
        agenda,
        location,
        isVirtual,
        timeSlots,
        remarks,
      } = req.body;

      // Check if user has permission to create meetings
      const userPermissions =
        ROLE_PERMISSIONS[(req as any).user?.role as UserRole] || [];
      if (!userPermissions.includes("create_meetings")) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to create meetings",
        });
      }

      // Validate required fields
      if (
        !organizer ||
        !host ||
        !participants ||
        !scope ||
        !title ||
        !timeSlots ||
        timeSlots.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate meeting scope
      if (!["general", "departments", "separate"].includes(scope)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid meeting scope. Must be 'general', 'departments', or 'separate'",
        });
      }

      // Validate departments if scope is 'departments'
      if (
        scope === "departments" &&
        (!departments || departments.length === 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "Departments are required when scope is 'departments'",
        });
      }

      // Clear departments if scope is not 'departments'
      const finalDepartments = scope === "departments" ? departments : [];


      // Check availability first
      const people = [host, ...participants];
      const availabilityResults = await MeetingService.checkAvailability(
        people,
        timeSlots
      );

      console.log("availabilityResults :", availabilityResults);

      // Find participants with conflicts
      const participantsWithConflicts = [];
      for (
        let slotIndex = 0;
        slotIndex < availabilityResults.length;
        slotIndex++
      ) {
        const slotResults = availabilityResults[slotIndex];
        for (const result of slotResults) {
          if (result.status !== "available") {
            // Get user details for the conflict
            const employee = await mongoose
              .model("Employee")
              .findById(result.employeeId);
            if (employee) {
              let conflictingMeeting = undefined;
              if (result.conflictingMeetingId) {
                const meeting = await Meeting.findById(
                  result.conflictingMeetingId
                ).select("title timeSlots");
                if (meeting) {
                  conflictingMeeting = {
                    id: meeting._id,
                    title: meeting.title,
                    timeSlots: meeting.timeSlots,
                  };
                }
              }
              participantsWithConflicts.push({
                userId: result.employeeId,
                userName: employee.name,
                isAvailable: false,
                reason: result.reason,
                conflictingMeeting,
              });
            }
          }
        }
      }

      // If there are conflicts, return response without creating meeting
      if (participantsWithConflicts.length > 0) {
        console.log(participantsWithConflicts);
        return res.status(200).json({
          success: false,
          message: "Meeting conflicts detected",
          conflicts: participantsWithConflicts,
        });
      }

      // Create the meeting only if no conflicts
      const { meeting, availabilityLogs } = await MeetingService.createMeeting({
        organizer,
        host,
        participants,
        scope,
        departments: finalDepartments,
        title,
        agenda,
        location,
        isVirtual,
        timeSlots,
        remarks,
      });

      res.status(201).json({
        success: true,
        data: meeting,
        availabilityLogs,
      });
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create meeting !!",
      });
    }
  }

  // Force create meeting (override conflicts)
  static async forceCreateMeeting(req: Request, res: Response) {
    try {
      const meetingData = req.body;

      // Check permissions
      const userPermissions =
        ROLE_PERMISSIONS[(req as any).user?.role as UserRole] || [];
      if (!userPermissions.includes("create_meetings")) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to create meetings",
        });
      }

      const { meeting, availabilityLogs } = await MeetingService.createMeeting(
        meetingData,
        true
      );

      res.status(201).json({
        success: true,
        data: meeting,
        availabilityLogs,
        message: "Meeting created and schedules updated",
      });
    } catch (error: any) {
      console.error("Error force creating meeting:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create meeting!!!",
      });
    }
  }

  // Get meetings for a user
  static async getUserMeetings(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const requestingUser = (req as any).user;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Get user permissions
      const userPermissions =
        ROLE_PERMISSIONS[requestingUser?.role as UserRole] || [];

      // Check if user can view meetings
      if (
        !userPermissions.includes("view_all_meetings") &&
        !userPermissions.includes("view_department_meetings")
      ) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view meetings",
        });
      }

      const meetings = await MeetingService.getUserMeetings(
        userId,
        requestingUser?.role as UserRole,
        requestingUser?.departments
      );

      res.json({
        success: true,
        data: meetings,
      });
    } catch (error: any) {
      console.error("Error fetching user meetings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meetings !!!!",
      });
    }
  }

  // Get meeting by ID
  static async getMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findById(meetingId)
        .populate("organizer", "name email")
        .populate("host", "name email")
        .populate("participants", "name email");

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      res.json({
        success: true,
        data: meeting,
      });
    } catch (error: any) {
      console.error("Error fetching meeting:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch meeting",
      });
    }
  }

  // Update meeting
  static async updateMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const updateData = req.body;

      // Get the current meeting before update
      const currentMeeting = await Meeting.findById(meetingId);

      const meeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
        .populate("organizer", "name email")
        .populate("host", "name email")
        .populate("participants", "name email")
        .populate("departments", "departmentName");

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      // If status changed to completed or cancelled, clean up availability
      if (
        updateData.status &&
        (updateData.status === "completed" ||
          updateData.status === "cancelled") &&
        currentMeeting
      ) {
        const allAffectedUsers = [
          currentMeeting.host,
          ...currentMeeting.participants,
        ];
        for (const userId of allAffectedUsers) {
          for (const slot of currentMeeting.timeSlots) {
            await Availability.deleteMany({
              employeeId: userId,
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
              reason: {
                $regex: `Meeting: ${currentMeeting.title}`,
                $options: "i",
              },
            });
          }
        }
      }

      res.json({
        success: true,
        data: meeting,
      });
    } catch (error: any) {
      console.error("Error updating meeting:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update meeting",
      });
    }
  }

  // Update meeting time slots
  static async updateMeetingTimeSlots(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const { timeSlots, forceSchedule = false } = req.body;

      const { meeting, availabilityLogs } =
        await MeetingService.updateMeetingTimeSlots(
          meetingId,
          timeSlots,
          forceSchedule
        );

      res.json({
        success: true,
        data: meeting,
        availabilityLogs,
      });
    } catch (error: any) {
      console.error("Error updating meeting time slots:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update meeting time slots",
      });
    }
  }

  // Delete meeting
  static async deleteMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { status: "cancelled" },
        { new: true }
      );

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      // Clean up availability entries for participants and host
      const allAffectedUsers = [meeting.host, ...meeting.participants];
      for (const userId of allAffectedUsers) {
        for (const slot of meeting.timeSlots) {
          await Availability.deleteMany({
            employeeId: userId,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            reason: { $regex: `Meeting: ${meeting.title}`, $options: "i" },
          });
        }
      }

      res.json({
        success: true,
        message: "Meeting cancelled successfully",
      });
    } catch (error: any) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete meeting",
      });
    }
  }

  // Get availability logs for a meeting
  static async getMeetingAvailabilityLogs(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;

      const logs = await MeetingService.getMeetingAvailabilityLogs(meetingId);

      res.json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      console.error("Error fetching availability logs:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch availability logs",
      });
    }
  }

  // Get available time slots for a date
  static async getAvailableSlots(req: Request, res: Response) {
    try {
      const { date, duration = 30 } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }

      // This would need more implementation for generating available slots
      // For now, return a basic response
      const availableSlots: any[] = [
        // Generate time slots for the day
        // This is a simplified implementation
      ];

      res.json({
        success: true,
        data: availableSlots,
      });
    } catch (error: any) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch available slots",
      });
    }
  }
}
