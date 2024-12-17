import { UserRole } from "../enums/userRole";

declare global {
    namespace Express {
        interface User {
            id: string;
            roles: UserRole[];
        }

        interface Request {
            user?: User;
        }
    }
}
