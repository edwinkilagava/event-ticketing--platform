
import mongoose from "mongoose";

const organizerApplicationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["not_applied", "pending", "approved", "rejected"],
      default: "not_applied",
      required: true,
    },

    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    contactPhone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    submittedAt: {
      type: Date,
    },

    reviewedAt: {
      type: Date,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "organizer", "admin"],
      default: "customer",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    organizerApplication: {
      type: organizerApplicationSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
