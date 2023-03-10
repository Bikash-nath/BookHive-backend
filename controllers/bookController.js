const Book = require('../models/bookModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Genre = require('../models/genreModel');

exports.aliasBestsellers = (req, res, next) => {
  req.query.limit = 15;
  req.query.sort = '-ratingsTotal,-ratingsAvg';
  req.query.fields = 'title,image,author,slug';
  next();
};

exports.aliasAudiobooks = (req, res, next) => {
  req.query.limit = 15;
  req.query.sort = '-ratingsAvg,-ratingsTotal';
  req.query.fields = 'title,image,author,slug';
  next();
};

exports.aliasLatestBooks = (req, res, next) => {
  req.query.limit = 15;
  req.query.sort = '-ratingsAvg,-createdAt';
  req.query.fields = 'title image author slug';
  next();
};

exports.getAllBooks = factory.getAll(Book); //{_id:0} - fields without _id
exports.getBook = factory.getOne(Book, { path: 'reviews' });
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

exports.searchBooks = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword;
  const books = await Book.find({ title: { $regex: `.*${keyword}.*` } });
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: books,
  });
});

exports.getSimilarBooks = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  let genreBooksList = [];
  let authorBooksList = [];
  book.genres.forEach(async (genreId) => {
    const genre = await Genre.findById(genreId);
    // genreBooksList.forEach((book) => genreBooksList.push(book));
    // console.log('genre:->', genre.books);
    genreBooksList = genre.books;
    // genreBooksList = [...genreBooksList, ...genre.books];
  });
  // console.log(genreBooksList);
  const similarBooks = [];

  genreBooksList.forEach((genreBook) => {
    if (genreBook.origin === book.origin && genreBook.language === book.language) {
      similarBooks.push(genreBook);
    }
  });

  // console.log('\n\n---->\n');
  // console.log(similarBooks, '\n');

  res.status(200).json({
    status: 'success',
    results: similarBooks.length,
    data: {
      data: similarBooks,
    },
  });
});

/*
exports.getTopBooks = catchAsync(async (req, res, next) => {
  // const features = new APIFeatures(Book.find(), { ...req.query, ...req.docFilter }).filter().sort().limitFields();
  const books = await Book.find().sort('bestsellerRank');

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      data: books,
    },
  });
});*/
