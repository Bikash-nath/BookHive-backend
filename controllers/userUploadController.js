const UserUpload = require('../models/user/userUploadModal')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
// const factory = require('./handlerFactory');
// const filterObj = require('../utils/filterObject');

exports.getUserUploads = catchAsync(async (req, res, next) => {
	const uploads = await UserUpload.find({ user: req.user.id }).sort('-createdAt')

	if (!uploads) {
		return next(new AppError(`No books found in your uploads`, 404))
	}

	res.status(200).json({
		status: 'success',
		uploads,
	})
})

exports.createUserUpload = catchAsync(async (req, res, next) => {
	console.log('\nuser', req.user.id, '\nbook', req.body.book, '\nreq.body', req.body)

	const uploadBook = await UserUpload.create({
		user: req.user.id,
		book: req.body.book,
		...req.body,
		...req.docFilter,
	})
	res.status(201).json({
		status: 'success',
		data: uploadBook,
	})
})
