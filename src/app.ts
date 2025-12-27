import express, { Application } from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.routes";
import productRouter from "./routes/product.routes";
import orderRouter from "./routes/order.routes";

dotenv.config({ quiet: true });

const app: Application = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

export default app;
