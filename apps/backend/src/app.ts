import express from "express";
import cors from "cors";
import visitorRoutes from "./routes/visitor.routes";
import recordsRoutes from "./routes/records.routes";
import employeeRoutes from "./routes/Employee.routes"
import authRoutes from "./routes/Auth.routes"
import visitRoutes from "./routes/visits.routes"
import deliveryRoutes from "./routes/Delivery.routes"
import departmentRoutes from "./routes/department.routes"
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',        // web (Vite)
    'http://localhost:5174',        // web (Vite)
    'http://localhost:19006',       // Expo dev
    'exp://localhost:19000',        // Expo Go
    'http://10.0.2.2:3000',         // Android emulator
    'http://100.110.69.126:5173/',
    'http://192.168.56.1:5173/',
    'http://localhost:3000',         // optional
    process.env.FRONTEND_URL || 'https://workplace-management-system-website.onrender.com' // Production Frontend
];

app.use(cors({
    origin: (origin, callback) => {
        // allow mobile apps with no origin header
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes)

app.use("/api/visitors", visitorRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/records", recordsRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/departments', departmentRoutes);


export default app;
