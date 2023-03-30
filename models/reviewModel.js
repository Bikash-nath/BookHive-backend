const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Review title can not be empty!'],
      maxlength: [50, 'Description must have atleast 50 characters'],
    },
    description: {
      type: String,
      minlength: [50, 'Description must have atleast 50 characters'],
      maxlength: [500, 'Description must have atmost 400 characters'],
    },
    rating: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'Author',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'UserProfile',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE - child populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
