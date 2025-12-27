import { UUID } from "node:crypto";

type orderStatus = "created" | "paid" | "cancelled";

type orderItemsType = 
[
	{
		productId: UUID;
		quantity: number;
		priceAtPurchase: number;
	}
] | []

type orderType = {
	id: UUID;
	userId: UUID;
	items: orderItemsType;
	totalAmount: number;
	status: orderStatus;
	createdAt: string;
};


export { orderType, orderItemsType, orderStatus };