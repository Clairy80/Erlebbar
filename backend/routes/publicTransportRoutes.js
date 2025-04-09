import express from "express";
import { getNearbyPublicTransport } from "../controllers/publicTransportController.js";

const router = express.Router();

router.get("/", getNearbyPublicTransport); // z. B. /api/public-transport?lat=51.1&lon=10.2

export default router;
