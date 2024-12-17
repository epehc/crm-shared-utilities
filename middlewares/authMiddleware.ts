import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/userRole";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; roles: string[] };

        // Validate roles to ensure they match the UserRole enum
        const validatedRoles = decoded.roles.filter((role) =>
            Object.values(UserRole).includes(role as UserRole)
        ) as UserRole[];

        req.user = {
            id: decoded.id,
            roles: validatedRoles, // Only valid UserRole values
        };

        next();
    } catch (error) {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};
