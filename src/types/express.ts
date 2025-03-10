import { SessionUser } from "./SessionUser";

declare global {
    namespace Express {
        export interface User extends SessionUser { } // Define user as optional
    }
}

export class ApiError extends Error {
    constructor(error: Error | string, status?: number) {
        if (typeof error === 'string') {
            error = new Error(error);
        }
        super(error.message);
        this.stack = error.stack;
        this.name = error.name;
        this.message = error.message;
        this.status = status ?? 500;
    }
    public status: number;
}

