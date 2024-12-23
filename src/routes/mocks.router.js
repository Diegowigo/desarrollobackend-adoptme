import express from "express";
import MockingController from "../controllers/mocks.controller.js";

const router = express.Router();

router.get("/mockingpets", MockingController.getMockPets);
router.get("/mockingusers", MockingController.getMockUsers);
router.post("/generateData", MockingController.generateData);

export default router;
