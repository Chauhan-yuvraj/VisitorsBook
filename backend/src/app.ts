import express from "express";
import cors from "cors";
import visitorRoutes from "./routes/visitor.routes";
import recordsRoutes from "./routes/records.routes";

const app = express();

app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api/visitors", visitorRoutes);
app.use("/api/records", recordsRoutes);


export default app;
