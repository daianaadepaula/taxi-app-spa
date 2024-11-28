import express from "express";
import { createDriver, getAllDrivers } from "../controllers/driverController";

const router = express.Router()

router.post("/", createDriver);
router.get("/", getAllDrivers);

export default router;
