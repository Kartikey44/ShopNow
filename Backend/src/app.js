import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routers/user.route.js";
import productRouter from "./routers/product.route.js";
import categoryRouter from "./routers/categories.route.js";

import errorMiddleware from "./middlewares/error.middleware.js";


export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

// Error Middleware (Must be the last middleware)
app.use(errorMiddleware);
