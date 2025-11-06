import Booking from "../models/booking.js";
export const createBooking = async (req, res) => {
  try {
    const { eventId, seatsBooked } = req.body;

    const booking = await Booking.create({
      event: eventId,
      user: req.user.id,
      seatsBooked,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate("event")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the user who made the booking or an admin can cancel it
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { seatsBooked } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the user who made the booking or an admin can update it
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this booking",
      });
    }

    booking.seatsBooked = seatsBooked || booking.seatsBooked;

    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "event"
    );
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await Booking.find({ event: eventId }).populate("user");
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings by event error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings for the event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getBookingForMyEvents = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "event",
        match: { creator: req.user.id },
      })
      .populate("user");
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings for my events error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings for your events",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
