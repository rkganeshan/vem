import request from "supertest";
import app from "../app";
import { Event } from "../models/Event";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup";

describe("Event Controller", () => {
  let organizerToken: string;
  let attendeeToken: string;
  let organizerId: string;
  let attendeeId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Create organizer
    const organizerRes = await request(app).post("/api/auth/register").send({
      name: "Organizer",
      email: "organizer@example.com",
      password: "password123",
      role: "organizer",
    });
    organizerToken = organizerRes.body.data.token;
    organizerId = organizerRes.body.data.user.id;

    // Create attendee
    const attendeeRes = await request(app).post("/api/auth/register").send({
      name: "Attendee",
      email: "attendee@example.com",
      password: "password123",
      role: "attendee",
    });
    attendeeToken = attendeeRes.body.data.token;
    attendeeId = attendeeRes.body.data.user.id;
  });

  describe("POST /api/events", () => {
    const eventData = {
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring latest innovations",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      time: "09:00",
      location: "Convention Center",
      maxParticipants: 100,
    };

    it("should create event as organizer", async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(eventData.title);
      expect(response.body.data.event.organizerId).toBeTruthy();
    });

    it("should fail to create event as attendee", async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should fail without authentication", async () => {
      await request(app).post("/api/events").send(eventData).expect(401);
    });

    it("should fail with invalid date", async () => {
      const invalidEvent = {
        ...eventData,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Past date
      };

      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send(invalidEvent)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should fail with missing required fields", async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Test Event",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/events", () => {
    beforeEach(async () => {
      // Create some test events
      await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Event 1",
          description: "Description for event 1",
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Location 1",
        });

      await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Event 2",
          description: "Description for event 2",
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          time: "14:00",
          location: "Location 2",
        });
    });

    it("should get all events", async () => {
      const response = await request(app)
        .get("/api/events")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.events).toHaveLength(2);
    });

    it("should fail without authentication", async () => {
      await request(app).get("/api/events").expect(401);
    });
  });

  describe("GET /api/events/:id", () => {
    let eventId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Test Event",
          description: "Test Description",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Test Location",
        });
      eventId = response.body.data.event._id;
    });

    it("should get event by id", async () => {
      const response = await request(app)
        .get(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event._id).toBe(eventId);
    });

    it("should fail with invalid id", async () => {
      await request(app)
        .get("/api/events/invalid-id")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(400);
    });

    it("should fail with non-existent id", async () => {
      await request(app)
        .get("/api/events/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(404);
    });
  });

  describe("PUT /api/events/:id", () => {
    let eventId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Original Event",
          description: "Original Description",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Original Location",
        });
      eventId = response.body.data.event._id;
    });

    it("should update event as organizer owner", async () => {
      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Updated Event",
          description: "Updated Description",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe("Updated Event");
      expect(response.body.data.event.description).toBe("Updated Description");
    });

    it("should fail to update as attendee", async () => {
      await request(app)
        .put(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .send({ title: "Updated" })
        .expect(403);
    });

    it("should fail to update non-existent event", async () => {
      await request(app)
        .put("/api/events/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({ title: "Updated" })
        .expect(404);
    });
  });

  describe("DELETE /api/events/:id", () => {
    let eventId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Event to Delete",
          description: "This will be deleted",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Test Location",
        });
      eventId = response.body.data.event._id;
    });

    it("should delete event as organizer owner", async () => {
      const response = await request(app)
        .delete(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${organizerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify event is deleted
      const event = await Event.findById(eventId);
      expect(event).toBeNull();
    });

    it("should fail to delete as attendee", async () => {
      await request(app)
        .delete(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(403);
    });
  });

  describe("POST /api/events/:id/register", () => {
    let eventId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Registration Event",
          description: "Event for registration testing",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Test Location",
          maxParticipants: 2,
        });
      eventId = response.body.data.event._id;
    });

    it("should register for event successfully", async () => {
      const response = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.participants).toHaveLength(1);
    });

    it("should fail to register twice", async () => {
      // Register first time
      await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      // Try to register again
      const response = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("already registered");
    });

    it("should fail when event is full", async () => {
      // Create another attendee
      const attendee2Res = await request(app).post("/api/auth/register").send({
        name: "Attendee 2",
        email: "attendee2@example.com",
        password: "password123",
        role: "attendee",
      });
      const attendee2Token = attendee2Res.body.data.token;

      // Fill up the event
      await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`);

      await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendee2Token}`);

      // Create third attendee and try to register
      const attendee3Res = await request(app).post("/api/auth/register").send({
        name: "Attendee 3",
        email: "attendee3@example.com",
        password: "password123",
        role: "attendee",
      });
      const attendee3Token = attendee3Res.body.data.token;

      const response = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendee3Token}`)
        .expect(400);

      expect(response.body.error).toContain("full");
    });
  });

  describe("DELETE /api/events/:id/register", () => {
    let eventId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "Unregistration Event",
          description: "Event for unregistration testing",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Test Location",
        });
      eventId = response.body.data.event._id;

      // Register attendee
      await request(app)
        .post(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`);
    });

    it("should unregister from event successfully", async () => {
      const response = await request(app)
        .delete(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify participant is removed
      const event = await Event.findById(eventId);
      expect(event?.participants).toHaveLength(0);
    });

    it("should fail to unregister when not registered", async () => {
      // Create new attendee
      const newAttendeeRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "New Attendee",
          email: "newattendee@example.com",
          password: "password123",
          role: "attendee",
        });

      const response = await request(app)
        .delete(`/api/events/${eventId}/register`)
        .set("Authorization", `Bearer ${newAttendeeRes.body.data.token}`)
        .expect(400);

      expect(response.body.error).toContain("not registered");
    });
  });

  describe("GET /api/events/my-registrations", () => {
    beforeEach(async () => {
      // Create event and register
      const eventRes = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "My Registration Event",
          description: "Event for my registrations testing",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Test Location",
        });

      await request(app)
        .post(`/api/events/${eventRes.body.data.event._id}/register`)
        .set("Authorization", `Bearer ${attendeeToken}`);
    });

    it("should get registered events", async () => {
      const response = await request(app)
        .get("/api/events/my-registrations")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data.events[0].title).toBe("My Registration Event");
    });
  });

  describe("GET /api/events/my-events", () => {
    beforeEach(async () => {
      // Create events as organizer
      await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "My Event 1",
          description: "Description 1",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: "10:00",
          location: "Location 1",
        });

      await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .send({
          title: "My Event 2",
          description: "Description 2",
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          time: "14:00",
          location: "Location 2",
        });
    });

    it("should get organizer events", async () => {
      const response = await request(app)
        .get("/api/events/my-events")
        .set("Authorization", `Bearer ${organizerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });

    it("should fail as attendee", async () => {
      await request(app)
        .get("/api/events/my-events")
        .set("Authorization", `Bearer ${attendeeToken}`)
        .expect(403);
    });
  });
});
