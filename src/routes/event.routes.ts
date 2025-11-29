import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getMyEvents,
} from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../models/User";
import {
  createEventValidation,
  updateEventValidation,
} from "../middleware/validation.middleware";

const router = Router();

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Private
 */
router.get("/", authenticate, getAllEvents);

/**
 * @route   GET /api/events/my-registrations
 * @desc    Get user's registered events
 * @access  Private
 */
router.get("/my-registrations", authenticate, getMyRegistrations);

/**
 * @route   GET /api/events/my-events
 * @desc    Get events created by current user
 * @access  Private (Organizer only)
 */
router.get(
  "/my-events",
  authenticate,
  authorize(UserRole.ORGANIZER),
  getMyEvents
);

/**
 * @route   GET /api/events/:id
 * @desc    Get single event
 * @access  Private
 */
router.get("/:id", authenticate, getEventById);

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private (Organizer only)
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ORGANIZER),
  createEventValidation,
  createEvent
);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (Organizer only)
 */
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ORGANIZER),
  updateEventValidation,
  updateEvent
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (Organizer only)
 */
router.delete("/:id", authenticate, authorize(UserRole.ORGANIZER), deleteEvent);

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for an event
 * @access  Private
 */
router.post("/:id/register", authenticate, registerForEvent);

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Unregister from an event
 * @access  Private
 */
router.delete("/:id/register", authenticate, unregisterFromEvent);

export default router;
