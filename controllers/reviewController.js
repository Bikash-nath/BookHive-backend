const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.filterReviews = catchAsync(async (req, res, next) => {
  if (req.params.bookId) {
    req.docFilter = { book: req.params.bookId };
  } else {
    req.docFilter = { user: req.user.id };
  }
  next();
});

// Nested review routes
exports.setBookUserIds = (req, res, next) => {
  //set book id from query if not specified in body
  if (!req.body.book) req.body.book = req.params.bookId;
  if (!req.body.user) req.body.user = req.user.id; //from Protect middleware
  next();
};

exports.getUserReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review, { path: 'user' });
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
