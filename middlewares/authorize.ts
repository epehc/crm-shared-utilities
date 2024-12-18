import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/userRole";

export const authorize = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            res.status(403).json({ error: "Access denied: No user found" });
            return
        }

        if (!user.roles || user.roles.length === 0) {
            res.status(403).json({ error: "Access denied: No roles assigned" });
            return
        }

        const hasRole = user.roles.some((role) => requiredRoles.includes(role));
        if (!hasRole) {
            res.status(403).json({ error: "Access denied: Insufficient privileges" });
            return
        }

        next();
    };
};
