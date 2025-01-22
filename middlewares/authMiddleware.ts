import jwt from "jsonwebtoken";
import {Response, NextFunction } from "express";
import { UserRole } from "../enums/userRole";
import { Request } from "../types/express";


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            roles: string[]
        };

        console.log('decoded:', decoded)

        // Validate roles to ensure they match the UserRole enum
        const validatedRoles = decoded.roles.filter((role) =>
            Object.values(UserRole).includes(role as UserRole)
        ) as UserRole[];

        console.log('validatedRoles:', validatedRoles)

        req.user = {
            id: decoded.id,
            email: decoded.email,
            roles: validatedRoles, // Only valid UserRole values
        };

        console.log('req.user:', req.user)

        next();
    } catch (error) {
        res.status(403).json({ error: "Forbidden: Invalid token" });
        return
    }
};
