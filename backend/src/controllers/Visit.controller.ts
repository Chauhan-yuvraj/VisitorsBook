import { Request, Response } from "express";
import { Visit } from "../models/visits.model";
import { Visitor } from "../models/visitor.model";
import { Employee } from "../models/employees.model";

// --- Get All Visits ---
export const GetVisits = async (req: Request, res: Response) => {
    try {
        // Optional: Filter by status or host if query params are present
        const filter: any = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.hostId) {
            filter['host.id'] = req.query.hostId;
        }

        const visits = await Visit.find(filter).sort({ scheduledCheckIn: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: visits.length,
            data: visits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving visits.",
            error
        });
    }
};

// --- Get Single Visit ---
export const GetVisit = async (req: Request, res: Response) => {
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: visit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the visit.",
            error
        });
    }
};

// --- Schedule a Visit (Create) ---
export const ScheduleVisit = async (req: Request, res: Response) => {
    try {
        const { 
            visitorId, 
            hostId, 
            scheduledCheckIn, 
            isWalkIn,
            purpose
        } = req.body;

        if (!visitorId || !hostId || !scheduledCheckIn) {
            return res.status(400).json({ message: "Visitor ID, Host ID, and Scheduled Check-in time are required." });
        }

        // 1. Fetch Visitor Details for Snapshot
        const visitor = await Visitor.findById(visitorId);
        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found." });
        }

        // 2. Fetch Host Details for Snapshot
        const host = await Employee.findById(hostId);
        if (!host) {
            return res.status(404).json({ message: "Host (Employee) not found." });
        }

        // 3. Create Visit with Snapshots
        const newVisit = await Visit.create({
            visitor: {
                id: visitor._id,
                name: visitor.name,
                email: visitor.email,
                profileImgUri: visitor.profileImgUri,
                company: visitor.companyNameFallback, // or fetch from Organization if linked
                isVip: visitor.isVip
            },
            host: {
                id: host._id,
                name: host.name,
                department: host.department,
                profileImgUri: host.profileImgUri
            },
            status: "PENDING",
            isWalkIn: isWalkIn || false,
            purpose: purpose || "",
            scheduledCheckIn: new Date(scheduledCheckIn),
            // Initialize other fields if needed
        });

        res.status(201).json({
            success: true,
            message: "Visit scheduled successfully.",
            data: newVisit
        });

    } catch (error: any) {
        console.error("Schedule Visit Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while scheduling the visit.",
            error: error.message
        });
    }
};

// --- Update Visit ---
export const UpdateVisit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating snapshots directly via this endpoint if we want to keep integrity, 
        // but for flexibility allow updating status, times, etc.
        
        // If status changes to CHECKED_IN, we might want to set actualCheckIn
        if (updates.status === 'CHECKED_IN' && !updates.actualCheckIn) {
            updates.actualCheckIn = new Date();
        }
        // If status changes to CHECKED_OUT, set actualCheckOut
        if (updates.status === 'CHECKED_OUT' && !updates.actualCheckOut) {
            updates.actualCheckOut = new Date();
        }

        const visit = await Visit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Visit updated successfully",
            data: visit
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the visit.",
            error: error.message
        });
    }
};

// --- Delete Visit ---
export const DeleteVisit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const visit = await Visit.findByIdAndDelete(id);

        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Visit deleted successfully",
            data: visit
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the visit.",
            error: error.message
        });
    }
};
