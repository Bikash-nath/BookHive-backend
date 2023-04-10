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
  console.log('req.params.slug\n', req.params.slug);
  const genrePopulate = (query) => {
    return query.populate({
      path: 'books',
      select: 'title image author slug',
      options: {
        limit: 30,
        skip: (req.query.page - 1) * 30,
        sort: '-ratingsAvg',
      },
    });
  };
  let query = Genre.findOne({ slug: req.params.slug, ...req.docFilter });
  const genre = await genrePopulate(query);
  if (!genre) {
    return next(new AppError(`No genre found with that ID`, 404));
  }
  //if(!genre.books) {
  // const genres = req.params.slug.split('-');
  // let query = Genre.find({
  //   $or: [
  //     { title: { $regex: `.*${genres[0]}.*` }, $options: 'i' },
  //     { title: { $regex: `.*${genres[1]}.*` }, $options: 'i' },
  //   ],
  // });

  res.status(200).json({
    status: 'success',
    data: genre,
  });
});
