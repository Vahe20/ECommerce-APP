import { UUID } from "node:crypto";

type productType = {
	id: UUID;
	name: string;
	price: number;
	stock: number;
	createdAt: string;
};

export default productType;