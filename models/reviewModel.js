const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Review title can not be empty!'],
    },
    description: {
      liked: {
        type: String,
        minlength: [20, 'Possitive description must have atleast 20 characters'],
      },
      disliked: {
        type: String,
        minlength: [20, 'Negative description must have atleast 5 characters'],
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  //child populate - book !required
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
