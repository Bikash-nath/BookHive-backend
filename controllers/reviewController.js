const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.filterReviews = catchAsync(async (req, res, next) => {
  if (req.params.bookId) {
    req.docFilter = { book: req.params.bookId };
  } else if (req.params.authorId) {
    req.docFilter = { author: req.params.authorId };
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

exports.updateReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findByIdAndUpdate(req.params.id, req.body);

  if (!doc) {
    return next(new AppError(`No document found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.deleteReview = factory.deleteOne(Review);
