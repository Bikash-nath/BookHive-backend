const Genre = require('../models/genreModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')

exports.getTopGenres = catchAsync(async (req, res, next) => {
	let query = Genre.find().select('title slug').sort('-books').limit(30)
	const genres = await query
	if (!genres) {
		return next(new AppError(`No document found with that ID`, 404))
	}

	res.status(200).json({
		status: 'success',
		data: genres,
	})
})

exports.getGenreBooks = catchAsync(async (req, res, next) => {
	const genrePopulate = (query) => {
		return query.populate({
			path: 'books',
			select: 'title image author slug',
			options: {
				limit: 30,
				skip: (req.query.page - 1) * 30,
				sort: '-ratingsAvg',
			},
		})
	}
	let query = Genre.findOne({ slug: req.params.slug, ...req.docFilter })
	const genre = await genrePopulate(query)
	if (!genre) {
		return next(new AppError(`No genre found with that ID`, 404))
	}
	if (!genre.books.length) {
		const genreTitle = req.params.slug.split('-')
		const genresQuery = Genre.find({ title: { $regex: `.*${genreTitle[0]}.*` }, $options: 'i' })
		const genres = await genrePopulate(genresQuery)

		let genreBooks = []
		genres.forEach((genre) => {
			if (genre.books.length) genreBooks.push(...genre.books)
		})
		genre.books = genreBooks
	}
	res.status(200).json({
		status: 'success',
		data: genre,
	})
})
