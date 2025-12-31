import { Router } from "express";
import { MeetingController } from "../controllers/meeting.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All meeting routes require authentication
router.use(protect);

// Create meeting
router.post("/", MeetingController.createMeeting);

// Force create meeting (override conflicts)
router.post("/force", MeetingController.forceCreateMeeting);

// Get meetings for a user
router.get("/user/:userId", MeetingController.getUserMeetings);

// Get meeting by ID
router.get("/:meetingId", MeetingController.getMeeting);

// Update meeting
router.put("/:meetingId", MeetingController.updateMeeting);

// Update meeting time slots
router.put("/:meetingId/timeslots", MeetingController.updateMeetingTimeSlots);

// Delete meeting
router.delete("/:meetingId", MeetingController.deleteMeeting);

// Get availability logs for a meeting
router.get("/:meetingId/availability-logs", MeetingController.getMeetingAvailabilityLogs);

// Get available time slots
router.get("/available-slots", MeetingController.getAvailableSlots);

export default router;