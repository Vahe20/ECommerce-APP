import { UUID } from "node:crypto";
import role from "./userRole.type";

type userType = {
	id: UUID;
	email: string;
	passwordHash: string;
	role: role;
	createdAt: string;
	token?: string;
};

export default userType;
