import { UUID } from "node:crypto";
import role from "../types/userRole.type";
import { JwtPayload } from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export {};
