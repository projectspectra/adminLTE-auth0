import { SessionUser } from "./SessionUser";

declare global {
    namespace Express {
        export interface User extends SessionUser { } // Define user as optional
    }
}
