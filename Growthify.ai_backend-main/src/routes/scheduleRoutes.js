import express from "express";
import {
  createScheduleItem,
  deleteScheduleItem,
  getScheduleItems,
  updateScheduleItem,
} from "../controllers/scheduleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getScheduleItems);
router.post("/", createScheduleItem);
router.put("/:id", updateScheduleItem);
router.delete("/:id", deleteScheduleItem);

export default router;
