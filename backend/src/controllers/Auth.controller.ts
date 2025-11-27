import { Request, Response } from "express";
import { Employee } from "../models/employees.model";

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }

    // --- FIX 1: Add .select("+password") ---
    const user = await Employee.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        jobTitle: user.jobTitle,
        profileImgUri: user.profileImgUri,
        isActive: user.isActive,
        requiresPasswordChange: user.requiresPasswordChange 
      },
    });

  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};