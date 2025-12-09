import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { Employee } from "../models/employees.model";

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


export const authorize = (...roles:string[]) => {
    return (req: Request, res: Response, next: Function) => {

        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({ message: `Forbidden: User role ${req.user.role} does not have the required role`});
            return;
        }

        next();
    }

}