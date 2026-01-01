import { Meeting, IMeeting } from "../models/meeting.model";
import { MeetingAvailabilityLog } from "../models/meetingAvailabilityLog.model";
import { Availability } from "../models/availability.model";
import { Schedule } from "../models/schedules.model";
import { MeetingTimeSlot, UserRole, ROLE_PERMISSIONS } from "@repo/types";
import mongoose from "mongoose";

export interface AvailabilityCheckResult {
  employeeId: string;
  status: "available" | "unavailable" | "has_meeting" | "out_of_office";
  reason?: string;
  conflictingMeetingId?: string;
}

export class MeetingService {
  // Helper to get all attendees (participants + host)
  private static getAllAttendees(meetingData: Partial<IMeeting>): string[] {
    const attendees = meetingData.participants!.map((p: any) => p.toString());
    const hostId = meetingData.host!.toString();
    if (!attendees.includes(hostId)) {
      attendees.push(hostId);
    }
    return attendees;
  }

  // Check availability for participants at given time slots
  static async checkAvailability(
    participants: string[],
    timeSlots: MeetingTimeSlot[]
  ): Promise<AvailabilityCheckResult[][]> {
    const results: AvailabilityCheckResult[][] = [];

    for (const slot of timeSlots) {
      const slotResults: AvailabilityCheckResult[] = [];

      for (const participantId of participants) {
        const result = await this.checkParticipantAvailability(
          participantId,
          slot
        );
        slotResults.push(result);
      }

      results.push(slotResults);
    }

    return results;
  }

  // Check single participant's availability for a time slot
  private static async checkParticipantAvailability(
    participantId: string,
    timeSlot: MeetingTimeSlot
  ): Promise<AvailabilityCheckResult> {
    const startTime = new Date(timeSlot.startTime);
    const endTime = new Date(timeSlot.endTime);

    // Check for conflicting meetings
    const conflictingMeeting = await Meeting.findOne({
      participants: participantId,
      status: { $in: ["scheduled", "ongoing"] },
      timeSlots: {
        $elemMatch: {
          $or: [
            {
              startTime: { $lt: endTime },
              endTime: { $gt: startTime },
            },
          ],
        },
      },
    });

    if (conflictingMeeting) {
      return {
        employeeId: participantId,
        status: "has_meeting",
        reason: `Has existing meeting: ${conflictingMeeting.title}`,
        conflictingMeetingId: conflictingMeeting._id.toString(),
      };
    }

    // Check for availability blocks
    const availabilityBlock = await Availability.findOne({
      employeeId: participantId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (availabilityBlock) {
      return {
        employeeId: participantId,
        status: availabilityBlock.status.toLowerCase() as
          | "unavailable"
          | "out_of_office",
        reason: availabilityBlock.reason,
      };
    }

    // Check for existing schedules
    const existingSchedule = await Schedule.findOne({
      employeeId: participantId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      type: { $ne: "LEAVE" }, // Exclude leave as it might be acceptable
    });

    if (existingSchedule) {
      return {
        employeeId: participantId,
        status: "unavailable",
        reason: `Has ${existingSchedule.type.toLowerCase()}: ${existingSchedule.remarks || "No details"}`,
      };
    }

    return {
      employeeId: participantId,
      status: "available",
    };
  }

  // Create meeting and handle scheduling conflicts
  static async createMeeting(
    meetingData: Partial<IMeeting>,
    forceSchedule: boolean = false
  ): Promise<{ meeting: IMeeting; availabilityLogs: any[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the meeting
      const meeting = new Meeting(meetingData);
      await meeting.save({ session });

      // Check availability and create logs
      const timeSlotsForCheck = meetingData.timeSlots!.map((slot) => ({
        date: slot.date,
        startTime:
          typeof slot.startTime === "string"
            ? slot.startTime
            : new Date(slot.startTime).toISOString(),
        endTime:
          typeof slot.endTime === "string"
            ? slot.endTime
            : new Date(slot.endTime).toISOString(),
      }));
      const allAttendees = this.getAllAttendees(meetingData);
      const availabilityResults = await this.checkAvailability(
        allAttendees,
        timeSlotsForCheck
      );

      const availabilityLogs = [];

      // Process each time slot
      for (
        let slotIndex = 0;
        slotIndex < meetingData.timeSlots!.length;
        slotIndex++
      ) {
        const slot = meetingData.timeSlots![slotIndex];
        const slotResults = availabilityResults[slotIndex];

        for (const result of slotResults) {
          const log = new MeetingAvailabilityLog({
            meetingId: meeting._id,
            employeeId: result.employeeId,
            timeSlot: {
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            },
            availabilityStatus: result.status,
            reason: result.reason,
            conflictingMeetingId: result.conflictingMeetingId,
          });

          await log.save({ session });
          availabilityLogs.push(log);
        }
      }

      // Create availability entries for all attendees to mark slots as unavailable
      for (const slot of meetingData.timeSlots!) {
        for (const attendeeId of allAttendees) {
          console.log('Creating UNAVAILABLE availability for attendee:', attendeeId, 'slot:', slot.startTime, 'to', slot.endTime);
          await Availability.findOneAndUpdate(
            {
              employeeId: attendeeId,
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            },
            {
              status: "UNAVAILABLE",
              reason: `Meeting: ${meeting.title}`,
              createdBy: meeting.organizer,
            },
            { upsert: true, new: true, session }
          );
        }
      }

      // If forceSchedule is true, create schedule entries that override conflicts
      if (forceSchedule) {
        await this.createOverridingSchedules(meeting, session);
      }

      await session.commitTransaction();
      return { meeting, availabilityLogs };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Create schedule entries that override existing conflicts
  private static async createOverridingSchedules(
    meeting: IMeeting,
    session: mongoose.ClientSession
  ): Promise<void> {
    const allAttendees = this.getAllAttendees(meeting);

    for (const slot of meeting.timeSlots) {
      for (const attendeeId of allAttendees) {
        // Remove conflicting availability blocks
        await Availability.deleteMany(
          {
            employeeId: attendeeId,
            startTime: { $lt: slot.endTime },
            endTime: { $gt: slot.startTime },
          },
          { session }
        );

        // Remove conflicting schedules (except leave)
        await Schedule.deleteMany(
          {
            employeeId: attendeeId,
            startTime: { $lt: slot.endTime },
            endTime: { $gt: slot.startTime },
            type: { $ne: "LEAVE" },
          },
          { session }
        );

        // Create new schedule entry for the meeting
        const scheduleEntry = new Schedule({
          employeeId: attendeeId,
          created_by: meeting.organizer,
          source: "SYSTEM",
          type: "MEETING",
          startTime: slot.startTime,
          endTime: slot.endTime,
          remarks: `Meeting: ${meeting.title}`,
          isConfirmed: true,
        });

        await scheduleEntry.save({ session });
      }
    }
  }

  // Get meetings for a user based on their role and permissions
  static async getUserMeetings(userId: string, userRole?: UserRole, userDepartments?: string[]): Promise<IMeeting[]> {
    // For dashboard and user-specific meeting views, only return meetings where the user is directly involved
    // This ensures time slots only show when the user is actually busy
    const query: any = {
      status: { $ne: "cancelled" },
      $or: [
        { organizer: userId },
        { host: userId },
        { participants: userId }
      ]
    };

    return await Meeting.find(query)
      .populate("organizer", "name email")
      .populate("host", "name email")
      .populate("participants", "name email")
      .populate("departments", "departmentName")
      .sort({ createdAt: -1 });
  }

  // Get availability logs for a meeting
  static async getMeetingAvailabilityLogs(meetingId: string): Promise<any[]> {
    return await MeetingAvailabilityLog.find({ meetingId })
      .populate("employeeId", "name email")
      .populate("conflictingMeetingId", "title")
      .sort({ checkedAt: -1 });
  }

  // Update meeting time slots and re-check availability
  static async updateMeetingTimeSlots(
    meetingId: string,
    newTimeSlots: MeetingTimeSlot[],
    forceSchedule: boolean = false
  ): Promise<{ meeting: IMeeting; availabilityLogs: any[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const meeting = await Meeting.findById(meetingId).session(session);
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      // Store old time slots for cleanup
      const oldTimeSlots = meeting.timeSlots;

      // Update time slots
      meeting.timeSlots = newTimeSlots.map((slot) => ({
        date: slot.date,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
      }));
      await meeting.save({ session });

      // Remove old availability logs
      await MeetingAvailabilityLog.deleteMany({ meetingId }, { session });

      // Get all attendees
      const allAttendees = this.getAllAttendees(meeting);
      console.log('All attendees for meeting:', meeting.title, allAttendees);
      // Check new availability
      const availabilityResults = await this.checkAvailability(
        allAttendees,
        newTimeSlots
      );

      const availabilityLogs = [];

      for (let slotIndex = 0; slotIndex < newTimeSlots.length; slotIndex++) {
        const slot = newTimeSlots[slotIndex];
        const slotResults = availabilityResults[slotIndex];

        for (const result of slotResults) {
          const log = new MeetingAvailabilityLog({
            meetingId: meeting._id,
            employeeId: result.employeeId,
            timeSlot: {
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            },
            availabilityStatus: result.status,
            reason: result.reason,
            conflictingMeetingId: result.conflictingMeetingId,
          });

          await log.save({ session });
          availabilityLogs.push(log);
        }
      }

      // Remove old availability entries for old time slots
      for (const oldSlot of oldTimeSlots) {
        for (const attendeeId of allAttendees) {
          await Availability.deleteMany({
            employeeId: attendeeId,
            startTime: oldSlot.startTime,
            endTime: oldSlot.endTime,
            reason: { $regex: `Meeting: ${meeting.title}` },
          }, { session });
        }
      }

      // Create new availability entries for new time slots
      for (const newSlot of newTimeSlots) {
        for (const attendeeId of allAttendees) {
          await Availability.findOneAndUpdate(
            {
              employeeId: attendeeId,
              startTime: new Date(newSlot.startTime),
              endTime: new Date(newSlot.endTime),
            },
            {
              status: "UNAVAILABLE",
              reason: `Meeting: ${meeting.title}`,
              createdBy: meeting.organizer,
            },
            { upsert: true, new: true, session }
          );
        }
      }

      // Handle scheduling if forceSchedule is true
      if (forceSchedule) {
        await this.createOverridingSchedules(meeting, session);
      }

      await session.commitTransaction();
      return { meeting, availabilityLogs };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
