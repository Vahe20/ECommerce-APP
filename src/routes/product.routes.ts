import { Router, Request, Response, NextFunction } from "express";
import JsonStore from "../utils/jsonStore";
import productType from "../types/product.type";
import { randomUUID } from "node:crypto";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

const productRouter = Router();

productRouter.use(authMiddleware);

const productStore = new JsonStore<productType>("products.json");

const isValidProduct = (req: Request, res: Response, next: NextFunction) => {
	const { name, price, stock } = req.body;

	if (
		typeof name !== "string" ||
		name.trim().length === 0 ||
		typeof price !== "number" ||
		price < 0 ||
		typeof stock !== "number" ||
		stock < 0
	) {
		return res.status(400).json({ error: "Bad Request" });
	}

	next();
};

productRouter.get("/", (req: Request, res: Response) => {
	try {
		return res.status(200).json(productStore.readAll());
	} catch (e) {
		return res.status(400).json({ error: e });
	}
});

productRouter.get("/:id", (req: Request, res: Response) => {
	try {
		const product = productStore.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				error: "Product not found",
				id: req.params.id,
			});
		}

		return res.status(200).json(product);
	} catch (error) {
		return res.status(500).json({
			error: "Failed to fetch product",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

productRouter.post(
	"/",
	isValidProduct,
	roleMiddleware("admin"),
	(req: Request, res: Response) => {
		try {
			const { name, price, stock } = req.body;

			const newProduct = productStore.create({
				id: randomUUID(),
				name,
				price,
				stock,
				createdAt: new Date().toISOString(),
			});

			return res.status(201).json({
				name: newProduct.name,
				price: newProduct.price,
				stock: newProduct.stock,
			});
		} catch (e) {
			return res.status(400).json({ error: e });
		}
	}
);

productRouter.patch(
	"/:id",
	roleMiddleware("admin"),
	(req: Request, res: Response) => {
		try {
			const { name, price, stock } = req.body;

			const product = productStore.findById(req.params.id);

			if (!product) {
				return res.status(404).json({
					error: "Product not found",
					id: req.params.id,
				});
			}

			productStore.update(req.params.id, {
				name,
				price,
				stock,
			});

			return res.status(200).json({
				name,
				price,
				stock,
			});
		} catch {
			return res.status(404).json({ error: "Not Found" });
		}
	}
);

productRouter.delete(
	"/:id",
	roleMiddleware("admin"),
	(req: Request, res: Response) => {
		try {
			productStore.delete(req.params.id);
			return res.status(200).json({ message: "product is deleted" });
		} catch {
			return res.status(404).json({ error: "Not Found" });
		}
	}
);

export default productRouter;
