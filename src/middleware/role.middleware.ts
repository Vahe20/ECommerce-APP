import { Request, Response, NextFunction } from "express";
import role from "../types/userRole.type";

const roleMiddleware = (role: role) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || req.user.role !== role) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	};
};

export default roleMiddleware;
