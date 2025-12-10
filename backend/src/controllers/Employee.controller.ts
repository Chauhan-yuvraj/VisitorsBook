import { Request, Response } from "express"
import { Employee } from "../models/employees.model";
import bcrypt from 'bcrypt'
import { uploadImageToCloudinary } from "../utils/cloudinary";


export const GetMe = async (req: Request, res: Response) => { }

export const GetEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the employee.",
            error
        });
    }
};

export const GetEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving employees.",
            error
        });
    }
}

export const PostEmployee = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, department, jobTitle, role, isActive, password } = req.body;
        let profileImgUri = req.body.profileImgUri;

        if (req.file) {
            try {
                profileImgUri = await uploadImageToCloudinary(req.file.buffer);
            } catch (uploadError) {
                console.error("Image Upload Failed:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required." });
        }

        let finalPassword = password;
        if (!finalPassword) {
            finalPassword = Math.random().toString(36).slice(-8); // auto password
        }

        const employee = await Employee.create({
            name,
            email,
            phone,
            profileImgUri,
            department,
            jobTitle,
            role: role || "HOST",
            isActive: isActive === undefined ? true : (isActive === 'true' || isActive === true), // Handle string from FormData & Default
            password: finalPassword, // Use finalPassword
            requiresPasswordChange: true
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                profileImgUri: employee.profileImgUri
            }
        });

    } catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        console.error("Create Employee Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the employee.",
            error: error.message
        });
    }
}

export const DeleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndUpdate(id.trim(), { isActive: false }, { new: true });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Employee deactivated  successfully",
            data: {
                id: employee._id,
                name: employee.name,
                isActive: employee.isActive
            }
        });
    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the employee.",
            error
        });
    }
}

export const UpdateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Define exactly what can be updated to prevent "Over-posting" attacks
        // (e.g., preventing a user from changing their own 'isAdmin' flag if you didn't check it)
        const allowedUpdates = [
            'name', 'email', 'phone', 'profileImgUri', 
            'department', 'jobTitle', 'role', 'isActive'
        ];

        // 2. Filter req.body to only include allowed fields
        const updates: Record<string, any> = {};
        
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Handle file upload for update
        if (req.file) {
            try {
                updates.profileImgUri = await uploadImageToCloudinary(req.file.buffer);
            } catch (uploadError) {
                console.error("Image Upload Failed:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        // 3. Check if there is anything to update (including password)
        if (Object.keys(updates).length === 0 && !req.body.password && !req.file) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        // 4. Handle Password Hashing separately (Async operation)
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
            updates.requiresPasswordChange = false;
        }

        // Handle boolean conversion for isActive if it comes as string
        if (updates.isActive !== undefined) {
             updates.isActive = updates.isActive === 'true' || updates.isActive === true;
        }

        // 5. Perform Update
        // { new: true } returns the modified document rather than the original
        // { runValidators: true } ensures enums (like Role) and required fields are respected
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee
        });

    } catch (error: any) {
        // 6. Handle Duplicate Email Error (Mongoose Error Code 11000)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 7. Handle Invalid MongoDB Object ID
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID format"
            });
        }

        // 8. Handle Validation Errors (e.g., Invalid Enum value for Role)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: messages
            });
        }

        console.error("Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const GetActiveHostList = async (req: Request, res: Response) => {
    const hosts = await Employee.find({ role: "HOST", isActive: true }).select('name profileImgUri _id jobTitle').sort('name');
    res.status(200).json({
        success: true,
        data: hosts
    });
}

export const BulkImportEmployees = async (req: Request, res: Response) => { }