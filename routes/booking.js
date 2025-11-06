import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingForMyEvents,
  getBookingsByEvent,
} from "../controllers/booking.js";

// Protected routes for users
router.post("/", authenticate, authorize("user"), createBooking);
router.get("/my-bookings", authenticate, authorize("user"), getMyBookings);
router.get("/:bookingId", authenticate, authorize("user"), getBookingById);
router.put("/:bookingId", authenticate, authorize("user"), updateBooking);
router.delete("/:bookingId", authenticate, authorize("user"), cancelBooking);
//Protected routes for creators
router.get(
  "/bookings-for-my-events",
  authenticate,
  authorize("creator"),
  getBookingForMyEvents
);
//Protected routes for event organizers
router.get(
  "/event/:eventId/bookings",
  authenticate,
  authorize("creator"),
  getBookingsByEvent
);

export default router;
