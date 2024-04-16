import express from "express";
import cors from "cors";

import userRoute from "./routes/userRoute.js";
import roomRoute from "./routes/roomRoute.js";


const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/users", userRoute);
app.use("/rooms", roomRoute);

export default app;
