import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Event } from "../models/Event";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  ConflictError,
} from "../utils/errors";
import {
  sendEmail,
  generateEventRegistrationEmail,
} from "../utils/email.utils";

/**
 * Get all events
 * GET /api/events
 */
export const getAllEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, date, isActive } = req.query;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (date) {
      const searchDate = new Date(date as string);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const events = await Event.find(query)
      .populate("organizerId", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event by ID
 * GET /api/events/:id
 */
export const getEventById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name email")
      .populate("participants.userId", "name email");

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    res.status(200).json({
      success: true,
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new event
 * POST /api/events
 */
export const createEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const { title, description, date, time, location, maxParticipants } =
      req.body;

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      maxParticipants,
      organizerId: req.user._id,
    });

    const populatedEvent = await Event.findById(event._id).populate(
      "organizerId",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: { event: populatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event
 * PUT /api/events/:id
 */
export const updateEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user._id.toString()) {
      throw new AuthorizationError(
        "You are not authorized to update this event"
      );
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("organizerId", "name email");

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 * DELETE /api/events/:id
 */
export const deleteEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user._id.toString()) {
      throw new AuthorizationError(
        "You are not authorized to delete this event"
      );
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register for an event
 * POST /api/events/:id/register
 */
export const registerForEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    if (!event.isActive) {
      throw new ValidationError("This event is not active");
    }

    // Check if event date has passed
    const eventDateTime = new Date(event.date);
    if (eventDateTime < new Date()) {
      throw new ValidationError("Cannot register for past events");
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.participants.some(
      (participant) => participant.userId.toString() === req.user._id.toString()
    );

    if (isAlreadyRegistered) {
      throw new ConflictError("You are already registered for this event");
    }

    // Check if event is full
    if (
      event.maxParticipants &&
      event.participants.length >= event.maxParticipants
    ) {
      throw new ValidationError("Event is full");
    }

    // Register user
    event.participants.push({
      userId: req.user._id,
      registeredAt: new Date(),
    });

    await event.save();

    // Send confirmation email asynchronously
    const user = await User.findById(req.user._id);
    if (user) {
      sendEmail({
        to: user.email,
        subject: `Registration Confirmed: ${event.title}`,
        html: generateEventRegistrationEmail(
          user.name,
          event.title,
          event.date,
          event.time,
          event.location
        ),
      }).catch((err) => console.error("Failed to send email:", err));
    }

    const updatedEvent = await Event.findById(event._id)
      .populate("organizerId", "name email")
      .populate("participants.userId", "name email");

    res.status(200).json({
      success: true,
      message: "Successfully registered for event",
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unregister from an event
 * DELETE /api/events/:id/register
 */
export const unregisterFromEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    // Check if user is registered
    const participantIndex = event.participants.findIndex(
      (participant) => participant.userId.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      throw new ValidationError("You are not registered for this event");
    }

    // Remove participant
    event.participants.splice(participantIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully unregistered from event",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's registered events
 * GET /api/events/my-registrations
 */
export const getMyRegistrations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await Event.find({
      "participants.userId": req.user._id,
    })
      .populate("organizerId", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get events created by the current user (organizer)
 * GET /api/events/my-events
 */
export const getMyEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await Event.find({ organizerId: req.user._id })
      .populate("participants.userId", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};
