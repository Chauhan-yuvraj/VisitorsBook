import { Request, Response } from "express";
import { Visitor } from "../models/visitor.model";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { ROLE_PERMISSIONS, UserRole } from "@repo/types";

export const GetVisitors = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userPermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

        // Check if user has permission to view visitors
        if (!userPermissions.includes('view_all_visitors') && !userPermissions.includes('view_department_visitors')) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view visitors"
            });
        }

        let query = {};
        if (userPermissions.includes('view_department_visitors') && !userPermissions.includes('view_all_visitors')) {
            // Manager: filter by departments
            const userDepartments = user.departments || [];
            const departmentIds = userDepartments.map((dept: any) => 
                typeof dept === 'string' ? dept : dept._id
            );
            query = { departments: { $in: departmentIds } };
        }
        // For admin/HR with view_all_visitors, no filter (query = {})

        const visitors = await Visitor.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: visitors.length,
            data: visitors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving visitors.",
            error
        });
    }
};

export const GetVisitor = async (req: Request, res: Response) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        res.status(200).json({
            success: true,
            data: visitor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the visitor.",
            error
        });
    }
};

export const PostVisitor = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userPermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
        if (!userPermissions.includes('create_visitors')) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to create visitors"
            });
        }

        const {
            name,
            email,
            phone,
            isVip,
            isBlocked,
            notes,
            organizationId,
            companyNameFallback,
            departments
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        let profileImgUri = undefined;
        if (req.file) {
            profileImgUri = await uploadFileToCloudinary(req.file.buffer, 'image');
        }

        const visitor = await Visitor.create({
            name,
            email,
            phone,
            profileImgUri,
            isVip: isVip === 'true' || isVip === true, // Handle string from FormData
            isBlocked: isBlocked === 'true' || isBlocked === true,
            notes,
            organizationId,
            companyNameFallback,
            departments: departments ? (Array.isArray(departments) ? departments : [departments]) : []
        });

        res.status(201).json({
            success: true,
            message: "Visitor created successfully.",
            data: visitor
        });

    } catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        console.error("Create Visitor Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the visitor.",
            error: error.message
        });
    }
};

export const UpdateVisitor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const allowedUpdates = [
            'name', 'email', 'phone', 'profileImgUri', 
            'isVip', 'isBlocked', 'notes', 
            'organizationId', 'companyNameFallback', 'departments'
        ];

        const updates: Record<string, any> = {};
        
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                // Handle boolean conversions for FormData
                if (key === 'isVip' || key === 'isBlocked') {
                    updates[key] = req.body[key] === 'true' || req.body[key] === true;
                } else {
                    updates[key] = req.body[key];
                }
            }
        });

        // Handle Image Upload
        if (req.file) {
            const profileImgUri = await uploadFileToCloudinary(req.file.buffer, 'image');
            updates['profileImgUri'] = profileImgUri;
        }

        if (Object.keys(updates).length === 0 && !req.file) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        const updatedVisitor = await Visitor.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedVisitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Visitor updated successfully",
            data: updatedVisitor
        });

    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Visitor ID format"
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: messages
            });
        }

        console.error("Update Visitor Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const DeleteVisitor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const visitor = await Visitor.findByIdAndDelete(id);
        
        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Visitor deleted successfully",
            data: visitor
        });
    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the visitor.",
            error
        });
    }
};
