const UserLibrary = require('../models/user/userLibraryModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObject')
const Book = require('../models/bookModel')
const Author = require('../models/authorModel')
const Genre = require('../models/genreModel')

exports.createUserLibrary = catchAsync(async (req, res) => {
	const library = await UserLibrary.create({
		user: req.user.id,
		books: [],
		authors: [],
		genres: [],
		readLater: [],
		readHistory: [],
	})

	res.status(200).json({
		status: 'success',
		data: library,
	})
})

exports.getUserLibrary = catchAsync(async (req, res, next) => {
	let query = UserLibrary.findOne({ user: req.user.id })
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
				limit: 12,
			},
		})
		.populate({
			path: 'genres',
			select: 'title slug',
			options: {
				limit: 10,
			},
		})

	const library = await query
	if (!library) {
		return next(new AppError(`No user library found`, 404))
	}
	res.status(200).json({
		status: 'success',
		data: library,
	})
})

exports.getLibraryBooks = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	// .sort({ books: -1 });
	// options: {
	//   sortArray: {books: -1},
	// },

	if (!library.books) {
		return next(new AppError(`No books found in user library`, 404))
	}

	res.status(200).json({
		status: 'success',
		books: library.books,
	})
})

exports.getLibraryAuthors = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })

	if (!library.authors) {
		return next(new AppError(`No authors found in user library`, 404))
	}

	res.status(200).json({
		status: 'success',
		authors: library.authors,
	})
})

exports.getLibraryGenres = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })

	if (!library.genres) {
		return next(new AppError(`No genres found in user library`, 404))
	}

	res.status(200).json({
		status: 'success',
		genres: library.genres,
	})
})

exports.getReadHistory = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id }).sort({ createdAt: -1 })
	// options: {
	//   sortArray: {books: -1},
	// },

	if (!library.books) {
		return next(new AppError(`No books found in user library`, 404))
	}

	res.status(200).json({
		status: 'success',
		readHistory: library.readHistory,
	})
})

exports.addReadHistory = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	const book = await Book.findOne({ slug: req.body.bookId })
	if (!book) {
		return next(new AppError('No book found with that id', 404))
	}
	const historyIndex = library.readHistory.findIndex((history) => book.slug == history.slug)
	if (historyIndex === -1) {
		library.readHistory = [...library.readHistory, { book }]
	} else {
		library.readHistory = library.readHistory.filter((_, i) => i !== historyIndex)
		library.readHistory.push({ book })
	}
	await library.save()

	res.status(200).json({
		status: 'success',
		book: 'added',
	})
})

exports.removeReadHistory = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	const book = await Book.findOne({ slug: req.body.bookId })
	if (!book) {
		return next(new AppError('No book found with that id', 404))
	}
	const historyIndex = library.readHistory.findIndex((history) => book.slug == history.slug)
	if (historyIndex !== -1) {
		library.readHistory.filter((_, i) => i !== historyIndex)
	}
	await library.save()

	res.status(200).json({
		status: 'success',
		book: 'removed',
	})
})

exports.favouriteBook = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	const book = await Book.findOne({ slug: req.body.bookId })
	if (!book) {
		return next(new AppError('No book found with that id', 404))
	}
	const bookIndex = library.books.findIndex((b) => book.slug == b.slug)
	console.log('1. library.books', library.books.length)
	if (bookIndex === -1) {
		library.books.push(book)
	} else {
		library.books = library.books.filter((_, i) => i !== bookIndex)
	}
	await library.save()
	console.log('2. library.books', library.books.length)

	res.status(200).json({
		status: 'success',
		book: bookIndex === -1 ? 'saved' : 'removed',
	})
})

exports.followAuthor = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	const author = await Author.findOne({ slug: req.body.authorId })
	if (!author) {
		return next(new AppError(`No author found with that id`, 404))
	}
	const authorIndex = library.authors.findIndex((a) => author.slug == a.slug)
	if (authorIndex === -1) {
		library.authors.push(author)
	} else {
		library.authors = library.authors.filter((_, i) => i !== authorIndex)
	}
	await library.save()

	res.status(200).json({
		status: 'success',
		author: authorIndex === -1 ? 'followed' : 'unfollowed',
	})
})

exports.favouriteGenre = catchAsync(async (req, res, next) => {
	const library = await UserLibrary.findOne({ user: req.user.id })
	const genre = await Genre.findOne({ slug: req.body.genreId })
	if (!genre) {
		return next(new AppError(`No genre found with that id`, 404))
	}
	const genreIndex = library.genres.findIndex((a) => genre.slug == a.slug)
	if (genreIndex === -1) {
		library.genres.push(genre)
	} else {
		library.genres = library.genres.filter((_, i) => i !== genreIndex)
	}
	await library.save()

	res.status(200).json({
		status: 'success',
		genre: genreIndex === -1 ? 'saved' : 'removed',
	})
})
