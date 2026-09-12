const mongoose = require("mongoose");

// ==========================================
// OUTCOME HISTORY SCHEMA
// ==========================================

const outcomeSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    sector: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    employmentDate: {
      type: String,
      default: "",
    },

    checkInDate: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);


// ==========================================
// TRAINEE SCHEMA
// ==========================================

const traineeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    program: {
      type: String,
      required: true,
    },

    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    assessment: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // ========================================
    // CURRENT OUTCOME
    // ========================================

    status: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    sector: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    employmentDate: {
      type: String,
      default: "",
    },

    // ========================================
    // AI PREDICTION
    // ========================================

    risk: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },

    aiConfidence: {
      type: Number,
      default: 0,
    },

    recommendedAction: {
      type: String,
      default: "",
    },

    // ========================================
    // PERIODIC OUTCOME HISTORY
    // ========================================

    outcomeHistory: {
      type: [outcomeSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);


module.exports =
  mongoose.model("Trainee", traineeSchema);