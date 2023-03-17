const Genre = require('../models/genreModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopGenres = (req, res, next) => {
  req.query.limit = 30;
  req.query.sort = '-books';
  req.query.fields = 'title slug';
  next();
};

exports.aliasGenreBooks = (req, res, next) => {
  req.query.sort = '-books';
  next();
};

exports.getAllGenres = factory.getAll(Genre); //{_id:0} - fields without _id

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

/*
exports.getTopGenres = catchAsync(async (req, res, next) => {
  // sort based on genre-books.length

  res.status(200).json({
    status: 'success',
    results: genres.length,
    data: {
      data: genres,
    },
  });
});*/

// exports.createGenre = factory.createOne(Genre);
// exports.updateGenre = factory.updateOne(Genre);
// exports.deleteGenre = factory.deleteOne(Genre);
