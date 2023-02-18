const Author = require('../models/authorModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllAuthors = factory.getAll(Author, 'name image author slug');
exports.getAuthor = factory.getOne(Author, { path: 'reviews' }); //remove imageSm, _id
exports.createAuthor = factory.createOne(Author);
exports.updateAuthor = factory.updateOne(Author);
exports.deleteAuthor = factory.deleteOne(Author);

exports.getSimilarAuthors = catchAsync(async (req, res, next) => {
  const author = await Author.findById(req.params.id);
  const similarAuthors = author.genres.map(async (genre) => {
    await Author.find({ genres: genre });
  });

  res.status(200).json({
    status: 'success',
    results: similarAuthors.length,
    data: {
      data: similarAuthors,
    },
  });
});
