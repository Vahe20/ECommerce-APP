import { Router, Request, Response } from "express";
import JsonStore from "../utils/jsonStore";
import userType from "../types/user.type";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

const authRouter = Router();

const userStore = new JsonStore<userType>("users.json");

authRouter.post("/register", (req: Request, res: Response) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password)
			return res
				.status(400)
				.json({ error: "Email and password required" });


		if (role) {
			if (role != "admin" && role != "customer")
				return res.status(400).json({});
		}

		if (userStore.findOne((u: userType) => u.email === email))
			return res.status(400).json({ error: "User already exists" });

		const passwordHash = bcrypt.hashSync(password, 10);

		const newUser = userStore.create({
			id: randomUUID(),
			email,
			passwordHash,
			role: role || "customer",
			createdAt: new Date().toISOString(),
		});

		res.status(201).json({
			id: newUser.id,
			email: newUser.email,
			role: newUser.role,
		});
	} catch (error) {
		res.status(500).json({ error: "Registration failed" });
	}
});

authRouter.post("/login", (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).json({ error: "Email and password required" });

	const user = userStore.findOne(u => u.email === email);
	if (!user) return res.status(401).json({ error: "invalid credentials" });

	const isValid = bcrypt.compareSync(password, user.passwordHash);

	if (!isValid) return res.status(401).json({ error: "invalid credentials" });

	const token = jwt.sign(
		{ userId: user.id, role: user.role },
		process.env.JWT_SECRET!
	);

	return res.status(200).json({
		accessToken: token,
		user: {
			id: user.id,
			email: user.email,
			role: user.role,
		},
	});
});

export default authRouter;
