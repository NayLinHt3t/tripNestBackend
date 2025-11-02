import Event from "../models/event.js";

//public routes
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get all events error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//protected routes
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, availableSeats, category } =
      req.body;
    const event = await Event.create({
      title,
      description,
      category,
      availableSeats,
      date,
      location,
      creator: req.user.id,
    });
    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, category, availableSeats, date, location } =
      req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.availableSeats = availableSeats || event.availableSeats;

    await event.save();

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.remove();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user.id });
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get my events error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching my events",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
