import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { Employee } from "../models/employees.model";
import { Meeting } from "../models/meeting.model";
import { ROLE_PERMISSIONS, UserRole } from "@repo/types";

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export const protect = async (req: Request, res: Response, next: Function) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!
        ) as DecodedToken;

        const user = await Employee.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const checkPermission = (...requiredPermission: string[]) => {
    return (req: Request, res: Response, next: Function) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const userRole = user.role as UserRole;
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];

        // Check if user has 'all' permission or if any of the required permissions are in user's permissions
        const hasAccess = userPermissions.includes('all') || requiredPermission.some(permission => userPermissions.includes(permission));

        if (!hasAccess) {
            return res.status(403).json({ 
                success: false,
                message: "Forbidden: You do not have the required permission",
                required: requiredPermission,
                userRole: userRole,
                userPermissions: userPermissions
            });
        }

        next();
    }
}

export const checkMeetingEditPermission = async (req: Request, res: Response, next: Function) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const userRole = user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // Admin and HR can edit all meetings
    if (userPermissions.includes('edit_all_meetings')) {
        return next();
    }

    // Managers can edit meetings based on scope
    if (userPermissions.includes('edit_department_meetings')) {
        const meetingId = req.params.meetingId;
        if (!meetingId) {
            return res.status(400).json({ message: "Meeting ID is required" });
        }

        try {
            const meeting = await Meeting.findById(meetingId).populate('departments');
            if (!meeting) {
                return res.status(404).json({ message: "Meeting not found" });
            }

            // Check permissions based on meeting scope
            if (meeting.scope === 'general') {
                // Managers can edit general meetings
                return next();
            } else if (meeting.scope === 'departments') {
                // Check if user has any department that matches the meeting's departments
                const userDepartments = user.departments || [];
                const meetingDepartments = meeting.departments.map((dept: any) => dept._id.toString());

                const hasCommonDepartment = userDepartments.some((userDept: any) =>
                    meetingDepartments.includes(typeof userDept === 'string' ? userDept : userDept._id.toString())
                );

                if (hasCommonDepartment) {
                    return next();
                } else {
                    return res.status(403).json({
                        success: false,
                        message: "Forbidden: You can only edit meetings in your departments"
                    });
                }
            } else if (meeting.scope === 'separate') {
                // Only admins/HR can edit separate meetings
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission to edit separate meetings"
                });
            }
        } catch (error) {
            console.error("Error checking meeting edit permission:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Employees cannot edit any meetings
    return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit meetings"
    });
};