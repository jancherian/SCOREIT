const mongoose = require('mongoose');

const teamEntrySchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    periodScores: {
      type: [Number],
      default: [],
    },
    cricketData: {
      wickets: { type: Number, default: 0 },
      overs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    sport: {
      type: String, // sport id like "football", "cricket"
      required: true,
    },
    status: {
      type: String,
      enum: ['setup', 'live', 'halftime', 'fulltime'],
      default: 'setup',
    },
    currentPeriod: {
      type: Number,
      default: 0,
    },
    timer: {
      minutes: { type: Number, default: 0 },
      seconds: { type: Number, default: 0 },
    },
    teams: {
      type: [teamEntrySchema],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length === 2;
        },
        message: 'Match must have exactly 2 teams',
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);

