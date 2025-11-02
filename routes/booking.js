import express from "express";
const router = express.Router();

//user protected routes for bookings
router.get("/bookings", (req, res) => {
  // Handle fetching all bookings logic here
  res.send("List of all bookings");
});
router.get("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  // Handle fetching booking details logic here
  res.send(`Booking details for booking ID: ${bookingId}`);
});

router.post("/bookings", (req, res) => {
  // Handle creating a new booking logic here
  res.send("Booking created");
});

router.delete("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  // Handle deleting a booking logic here
  res.send(`Booking with ID: ${bookingId} deleted`);
});

export default router;
