const UserLibrary = require('../models/user/userLibraryModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObject');
const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const Genre = require('../models/genreModel');

exports.createUserLibrary = catchAsync(async (req, res) => {
  const library = await UserLibrary.create({
    user: req.user.id,
    books: [],
    authors: [],
    genres: [],
  });

  res.status(200).json({
    status: 'success',
    data: library,
  });
});

exports.getUserLibrary = catchAsync(async (req, res, next) => {
  let query = UserLibrary.findOne({ user: req.user.id });
  query = query
    .populate({
      path: 'books',
      select: 'title image author slug',
      options: {
        limit: 10,
      },
    })
    .populate({
      path: 'authors',
      select: 'name image author slug',
      options: {
        limit: 10,
      },
    })
    .populate({
      path: 'genres',
      select: 'title slug',
      options: {
        limit: 10,
      },
    });

  const library = await query;
  if (!library) {
    return next(new AppError(`No user library found`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: library,
  });
});

exports.getLibraryBooks = catchAsync(async (req, res, next) => {
  let query = UserLibrary.findOne({ user: req.user.id });
  query = query.populate({
    path: 'books',
    select: 'title image author slug',
  });
  const library = await query;
  if (!library.books) {
    return next(new AppError(`No books found in user library`, 404));
  }

  res.status(200).json({
    status: 'success',
    books: library.books,
  });
});

exports.getLibraryAuthors = catchAsync(async (req, res, next) => {
  let query = UserLibrary.findOne({ user: req.user.id });
  query = query.populate({
    path: 'authors',
    select: 'name image author slug',
  });
  const library = await query;
  if (!library.authors) {
    return next(new AppError(`No authors found in user library`, 404));
  }

  res.status(200).json({
    status: 'success',
    authors: library.authors,
  });
});

exports.getLibraryGenres = catchAsync(async (req, res, next) => {
  let query = UserLibrary.findOne({ user: req.user.id });
  query = query.populate({
    path: 'genres',
    select: 'title slug',
  });
  const library = await query;
  if (!library.genres) {
    return next(new AppError(`No genres found in user library`, 404));
  }

  res.status(200).json({
    status: 'success',
    genres: library.genres,
  });
});

exports.favouriteBook = catchAsync(async (req, res, next) => {
  const library = await UserLibrary.findOne({ user: req.user.id });
  const book = await Book.findOne({ slug: req.body.book });
  if (!book) {
    return next(new AppError(`No book found with that id`, 404));
  }
  const bookIndex = library.books.findIndex((b) => book.slug == b.slug);
  if (bookIndex === -1) library.books = [...library.books, book];
  else library.books = library.books.filter((_, i) => i !== bookIndex);

  await library.save();

  res.status(200).json({
    status: 'success',
    books: library.books,
  });
});

exports.followAuthor = catchAsync(async (req, res, next) => {
  const library = await UserLibrary.findOne({ user: req.user.id });
  const author = await Author.findOne({ slug: req.body.author });
  if (!author) {
    return next(new AppError(`No author found with that id`, 404));
  }
  const authorIndex = library.authors.findIndex((a) => author.slug == a.slug);
  if (authorIndex === -1) library.authors = [...library.authors, author];
  else library.authors = library.authors.filter((_, i) => i !== authorIndex);
  await library.save();

  res.status(200).json({
    status: 'success',
    authors: library.authors,
  });
});

exports.favouriteGenre = catchAsync(async (req, res, next) => {
  const library = await UserLibrary.findOne({ user: req.user.id });
  const genre = await Genre.findOne({ slug: req.body.genre });
  if (!genre) {
    return next(new AppError(`No genre found with that id`, 404));
  }
  const genreIndex = library.genres.findIndex((a) => genre.slug == a.slug);
  if (genreIndex === -1) library.genres = [...library.genres, genre];
  else library.genres = library.genres.filter((_, i) => i !== genreIndex);
  await library.save();

  res.status(200).json({
    status: 'success',
    genres: library.genres,
  });
});
