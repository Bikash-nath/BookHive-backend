const Genre = require('../models/genreModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getTopGenres = catchAsync(async (req, res, next) => {
  let query = Genre.find().select('title slug').sort('-books').limit(30);
  const genres = await query;
  if (!genres) {
    return next(new AppError(`No document found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: genres,
  });
});

exports.getGenreBooks = catchAsync(async (req, res, next) => {
  let query = Genre.findOne({ slug: req.params.slug, ...req.docFilter });
  query = query.populate({
    path: 'books',
    select: 'title image author slug',
    options: {
      limit: 30,
      skip: (req.query.page - 1) * 30,
      sort: '-ratingsAvg',
    },
  });
  const doc = await query;
  if (!doc) {
    return next(new AppError(`No document found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
