import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "No token provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);

		req.user = decoded as JwtPayload;

		next();
	} catch {
		return res.status(401).json({ error: "Invalid token" });
	}

	next();
};

export default authMiddleware;
