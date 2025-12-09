import jwt from 'jsonwebtoken'; // Make sure this is imported
import { Request, Response } from "express";

import { Employee } from "../models/employees.model";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";


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

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      jobTitle: user.jobTitle,
      profileImgUri: user.profileImgUri,
      isActive: user.isActive,
      requiresPasswordChange: user.requiresPasswordChange
    }


    // Set refresh token in HTTP-only cookie (FOR WEN)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 //  7 days
    });


    // Set refresh token in JSON Response (FOR MOBILE)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
      accessToken: accessToken,
      refreshToken: refreshToken
    });

  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const RefreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const cookies = req.cookies;
    let refreshToken = cookies?.jwt;

    // Mobile FallBack
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }

    const user = await Employee.findOne({ refreshToken }).exec();

    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      res.status(403).json({ success: false, message: "Forbidden , invalid refresh token" });
      return;
    }

    jwt.verify(
      refreshToken, process.env.JWT_REFRESH_SECRET as string,
      (err: any, decoded: any) => {
        if (err || user._id.toString() !== decoded.id) {
          res.status(403).json({ success: false, message: "Forbidden, token expired" });
          return;
        }
        const accessToken = generateAccessToken(user._id.toString());
        res.status(200).json({ success: true, accessToken });
      }
    )

  } catch (err: any) {
    console.error("RefreshAccessToken Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}