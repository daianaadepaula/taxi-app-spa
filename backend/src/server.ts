import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import rideRouter from "./routes/rideRoute";
import driverRouter from "./routes/driverRoute";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/ride", rideRouter);
app.use("/driver", driverRouter);

app.listen(PORT, () => {
	connectDB();
	console.log(`Servidor rodando na porta ${PORT}`);
});
