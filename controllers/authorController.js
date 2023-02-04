const Author = require('../models/AuthorModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllAuthors = factory.getAll(Author);
exports.getAuthor = factory.getOne(Author, { path: 'reviews' });
// exports.createAuthor = factory.createOne(Author);
// exports.updateAuthor = factory.updateOne(Author);
// exports.deleteAuthor = factory.deleteOne(Author);

exports.getSimilarAuthors = catchAsync(async (req, res, next) => {
  const book = await Author.findById(req.params.id);
  const similarAuthors = await Author.find({ genres: book.genres });
  res.status(200).json({
    status: 'success',
    results: similarAuthors.length,
    data: {
      data: similarAuthors,
    },
  });
});

exports.updateTopAuthors = catchAsync(async (req, res, next) => {
  const authors = await Author.find().sort('ratingsAverage').sort('totalFollowers').sort('numReviews');

  authors.forEach(async (book, order) => {
    await book.updateOne({ followerRank: order + 1 });
  });

  res.status(200).json({
    status: 'success',
    results: authors.length,
    data: {
      data: authors,
    },
  });
});
