import { Request, Response } from "express"
import { Employee } from "../models/employees.model";
import bcrypt from 'bcrypt'


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
        const { name, email, phone, profileImgUri, department, jobTitle, role, isActive, password, timestamps } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Name, email, phone, and password are required." });
        }

        const employee = await Employee.create({
            name,
            email,
            phone,
            profileImgUri,
            department,
            jobTitle,
            role: role || "HOST",
            isActive: isActive !== undefined ? isActive : true,
            password,
            requiresPasswordChange: true
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role
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
        
        // 1. Remove 'timestamps' from here. Mongoose handles it automatically.
        const { 
            name, email, phone, profileImgUri, 
            department, jobTitle, role, isActive, password 
        } = req.body;

        // 2. Optimization: Check if body is empty to save DB call
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No fields provided for update" 
            });
        }

        const updatedData: any = {};

        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (phone) updatedData.phone = phone;
        if (profileImgUri) updatedData.profileImgUri = profileImgUri;
        if (department) updatedData.department = department;
        if (jobTitle) updatedData.jobTitle = jobTitle;
        if (role) updatedData.role = role;
        
        // Keep this! Logic is perfect for booleans.
        if (isActive !== undefined) updatedData.isActive = isActive;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
            updatedData.requiresPasswordChange = false;
        }

        // 3. Perform Update
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id, 
            updatedData, 
            { new: true, runValidators: true } // runValidators ensures Role is valid (ADMIN, HOST...)
        ).select('-password');

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
        // 4. Handle Duplicate Email Error specificallly
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already exists" 
            });
        }

        // 5. Handle Invalid ID format (CastError)
        if (error.name === 'CastError') {
             return res.status(400).json({ 
                success: false, 
                message: "Invalid Employee ID" 
            });
        }

        res.status(500).json({
            success: false,
            message: "An error occurred while updating the employee.",
            error: error.message
        });
    }
}