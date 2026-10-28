
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required."],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
    },

    description: {
      type: String,
      required: [true, "Event description is required."],
      trim: true,
      maxlength: 10000,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    venue: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
      city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        default: "Kenya",
      },
    },

    startsAt: {
      type: Date,
      required: true,
      index: true,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    currency: {
      type: String,
      required: true,
      default: "KES",
      enum: ["KES"],
    },

    coverImageUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

eventSchema.index({ status: 1, startsAt: 1 });
eventSchema.index({ category: 1, status: 1, startsAt: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

eventSchema.pre("validate", function validateEventDates() {
  if (
    this.startsAt &&
    this.endsAt &&
    this.endsAt <= this.startsAt
  ) {
    this.invalidate("endsAt", "Event end time must be after start time.");
  }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
