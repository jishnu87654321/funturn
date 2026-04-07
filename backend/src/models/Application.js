const mongoose = require('mongoose');
const { APPLICATION_STATUSES, DEFAULT_STATUS, SOURCE_WEBSITE } = require('../constants');

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    instagramLink: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinLink: {
      type: String,
      trim: true,
      default: '',
    },
    collegeName: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    selectedCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Selected category is required'],
    },
    selectedCategoryName: {
      type: String,
      trim: true,
    },
    resumePath: {
      type: String,
      default: '',
    },
    resumeData: {
      type: Buffer,
      select: false,
    },
    resumeOriginalName: {
      type: String,
      required: true,
    },
    resumeMimeType: {
      type: String,
    },
    resumeSize: {
      type: Number,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: DEFAULT_STATUS,
    },
    statusHistory: [
      {
        status: { type: String, enum: APPLICATION_STATUSES },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: SOURCE_WEBSITE,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for admin filtering
applicationSchema.index({ email: 1 });
applicationSchema.index({ phoneNumber: 1 });
applicationSchema.index({ selectedCategory: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ selectedCategoryName: 1, createdAt: -1 });
applicationSchema.index({ email: 1, createdAt: -1 });

// Compound: duplicate detection (same email + category within timeframe)
applicationSchema.index({ email: 1, selectedCategory: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
