import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/auth.middleware";
import JsonStore from "../utils/jsonStore";
import productType from "../types/product.type";
import { orderItemsType, orderType } from "../types/order.type";
import { randomUUID } from "crypto";

const orderRouter = Router();

orderRouter.use(authMiddleware);

const productStore = new JsonStore<productType>("products.json");
const ordersStore = new JsonStore<orderType>("orders.json");

orderRouter.post("/", (req: Request, res: Response) => {
    const { items }: {items: orderItemsType} = req.body;
    if (!items || items.length <= 0)
        return res.status(400).json({});

    if (!req.user) {
        return res.status(400).json({});
    }

    let totalAmount = 0;

    for (const item of items) {
        const prod = productStore.findById(item.productId);
        if (prod) {
            if (prod.stock < item.quantity) {
                return res.status(400).json({});
            }
            totalAmount += item.priceAtPurchase;
        } else {
            return res.status(400).json([]);
        }
    }

    const newOrder = ordersStore.create({
        id: randomUUID(),
        userId: req.user.userId,
        items: items,
        totalAmount,
        status: 'created',
        createdAt: new Date().toISOString()
    })

    return res.status(200).json({message: newOrder})
});

export default orderRouter;