import express from "express";
import { confirmRide, getRides, estimateRide } from "../controllers/rideController";

const router = express.Router()

router.post("/estimate", estimateRide);
router.patch("/confirm", confirmRide);
router.get("/:customerId", getRides);

export default router;
