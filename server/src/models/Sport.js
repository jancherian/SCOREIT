const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
    },
    scoreLabel: {
      type: String,
      required: true,
    },
    periodLabels: {
      type: [String],
      default: [],
    },
    maxPeriods: {
      type: Number,
      required: true,
    },
    defaultTimerMinutes: {
      type: Number,
      default: 0,
    },
    hasExtraStats: {
      type: Boolean,
      default: false,
    },
    extraStats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Sport', sportSchema);

