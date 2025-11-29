import mongoose, { Document, Schema } from "mongoose";

export interface IParticipant {
  userId: mongoose.Types.ObjectId;
  registeredAt: Date;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizerId: mongoose.Types.ObjectId;
  participants: IParticipant[];
  maxParticipants?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    time: {
      type: String,
      required: [true, "Please provide an event time"],
    },
    location: {
      type: String,
      required: [true, "Please provide an event location"],
      trim: true,
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [participantSchema],
    maxParticipants: {
      type: Number,
      min: [1, "Maximum participants must be at least 1"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
eventSchema.index({ organizerId: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ isActive: 1 });

export const Event = mongoose.model<IEvent>("Event", eventSchema);
