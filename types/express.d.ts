import { UserRole } from "../enums/userRole";

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            roles: UserRole[];
        }

        interface Request {
            user?: User;
        }
    }
}

export {};