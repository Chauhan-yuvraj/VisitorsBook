import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { ROLE_PERMISSIONS, UserRole } from "@repo/types";

const generateAccessToken = (id: string | ObjectId, role: UserRole | string) => {
    const permissions = ROLE_PERMISSIONS[role as UserRole] || [];
    console.log(`Generating token for role: '${role}'`);
    console.log(`Available roles in ROLE_PERMISSIONS: ${Object.keys(ROLE_PERMISSIONS).join(', ')}`);
    console.log(`Permissions found: ${JSON.stringify(permissions)}`);

    return jwt.sign({ id: id.toString(), role, permissions }, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: "15m"
    })
}
const generateRefreshToken = (id: string | ObjectId) => {
    return jwt.sign({ id: id.toString() }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "30d"
    })
}

export { generateAccessToken, generateRefreshToken };