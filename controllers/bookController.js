const Book = require('../models/bookModel');
const Genre = require('../models/genreModel');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.aliasBestsellers = (req, res, next) => {
  if (!req.query.limit) req.query.limit = 30;
  req.query.sort = '-ratingsTotal,-ratingsAvg';
  req.query.fields = 'title,image,author,slug';
  next();
};

exports.aliasAudiobooks = (req, res, next) => {
  if (!req.query.limit) req.query.limit = 30;
  req.query.sort = '-ratingsAvg,-ratingsTotal';
  req.query.fields = 'title,image,author,slug';
  next();
};

exports.aliasLatestBooks = (req, res, next) => {
  if (!req.query.limit) req.query.limit = 30;
  req.query.sort = '-ratingsAvg,-createdAt';
  req.query.fields = 'title image author slug';
  next();
};

exports.getAllBooks = factory.getAll(Book); //{_id:0} - fields without _id
exports.getBook = factory.getOne(Book, { path: 'reviews' });
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

exports.getIndianBooks = catchAsync(async (req, res) => {
  let books;
  console.log(req.query);
  if (req.query.language == 'indian') books = await Book.find({ free: true }).sort('-ratingsAvg');
  else if (req.query.language == 'bangla') books = await Book.find({ language: 'Bangla' }).sort('-ratingsAvg');
  else books = await Book.find({ language: 'Punjabi' }).sort('-ratingsAvg');

  res.status(200).json({
    status: 'success',
    data: books,
  });
});

// exports.getRegionalBooks = catchAsync(async (req, res) => {
//   const books = await Book.find({ language: language }).sort('-ratingsAvg');

//   res.status(200).json({
//     status: 'success',
//     data: books,
//   });
// });

exports.searchBooks = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword;
  const features = new APIFeatures(Book.find({ title: { $regex: `.*${keyword}.*`, $options: 'i' } }), { ...req.query })
    .filter()
    .sort()
    .paginate();
  const books = await features.query;

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

  res.status(300).json({
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

  res.status(300).json({
    status: 'success',
    results: books.length,
    data: {
      data: books,
    },
  });
});*/
