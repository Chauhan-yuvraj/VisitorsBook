import { Request, Response } from "express";
import { Availability } from "../models/availability.model";
import { Employee } from "../models/employees.model";

// Get availability for an employee on a specific date
export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { employeeId, date } = req.query;
    console.log(employeeId);
    if (!employeeId || !date) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and date are required",
      });
    }

    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);

    const availabilities = await Availability.find({
      employeeId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ startTime: 1 });

    res.json({
      success: true,
      data: availabilities,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
    });
  }
};

// Create or update availability slots
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { employeeId, slots } = req.body;

    if (!employeeId || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and slots array are required",
      });
    }

    // Get the current user (assuming from auth middleware)
    const createdBy = req.user?._id || employeeId;

    const results = [];

    for (const slot of slots) {
      const { startTime, endTime, status, reason } = slot;

      if (!startTime || !endTime) {
        continue;
      }

      // Check if availability already exists for this time slot
      const existingAvailability = await Availability.findOne({
        employeeId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });

      if (existingAvailability) {
        // Update existing
        existingAvailability.status = status;
        if (reason !== undefined) {
          existingAvailability.reason = reason;
        }
        existingAvailability.createdBy = createdBy;
        await existingAvailability.save();
        results.push(existingAvailability);
      } else {
        // Create new
        const newAvailability = new Availability({
          employeeId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status,
          reason: reason || "",
          createdBy,
        });
        await newAvailability.save();
        results.push(newAvailability);
      }
    }

    res.json({
      success: true,
      data: results,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

// Delete availability slot
export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const availability = await Availability.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability slot not found",
      });
    }
    res.json({
      success: true,
      message: "Availability slot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability slot",
    });
  }
};
