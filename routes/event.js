import express from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import {
  getAllEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from "../controllers/event.js";
const router = express.Router();

//public routes
router.get("/events", getAllEvents);
router.get("/events/:eventId", getEventDetails);
//protected routes
router.post("/events", authenticate, authorize("creator"), createEvent);
router.get("/my-events", authenticate, authorize("creator"), getMyEvents);
router.put("/events/:eventId", authenticate, authorize("creator"), updateEvent);
router.delete(
  "/events/:eventId",
  authenticate,
  authorize("creator", "admin"),
  deleteEvent
);
export default router;
