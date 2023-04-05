const moongoose = require("mongoose");

const JobSchema = new moongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: moongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);
module.exports = moongoose.model("Job", JobSchema);
