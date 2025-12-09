import { Request, Response } from "express";
import { Visitor } from "../models/visitor.model";

export const GetVisitors = async (req: Request, res: Response) => {
    try {
        const visitors = await Visitor.find().sort({ createdAt: -1 });
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
        const { 
            name, 
            email, 
            phone, 
            profileImgUri, 
            isVip, 
            isBlocked, 
            notes, 
            organizationId, 
            companyNameFallback 
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        const visitor = await Visitor.create({
            name,
            email,
            phone,
            profileImgUri,
            isVip: isVip || false,
            isBlocked: isBlocked || false,
            notes,
            organizationId,
            companyNameFallback
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
            'organizationId', 'companyNameFallback'
        ];

        const updates: Record<string, any> = {};
        
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
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
