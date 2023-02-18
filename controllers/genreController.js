const Genre = require('../models/genreModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

exports.getAllGenres = factory.getAll(Genre, 'title slug'); //{_id:0} - fields without _id
exports.getGenreBooks = factory.getOne(Genre).populate({
  path: 'books',
  select: 'title image author slug',
});

// exports.createGenre = factory.createOne(Genre);
// exports.updateGenre = factory.updateOne(Genre);
// exports.deleteGenre = factory.deleteOne(Genre);
