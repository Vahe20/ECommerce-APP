import { UUID } from "node:crypto";

type orderStatus = "created" | "paid" | "cancelled";

type orderType = {
	id: UUID;
	userId: UUID;
	items: [
		{
			productId: UUID;
			quantity: number;
			priceAtPurchase: number;
		}
	];
	totalAmount: number;
	status: orderStatus;
	createdAt: string;
};


export default orderType;