const AppError = require('../utils/appError')

const handleCastErrorDB = (error) => {
	const message = `Invalid field ${error.path} value: ${error.value}.`
	return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (error) => {
	const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0] //extract field value between quotes
	const message = `Duplicate field value: ${value}. Please use another value!`
	return new AppError(message, 400)
}
const handleValidationErrorDB = (error) => {
	const errors = Object.values(error.errors).map((el) => el.message)
	const message = `Invalid input data. ${errors.join('. ')}`
	return new AppError(message, 400)
}

const sendErrorDev = (error, res) => {
	console.error('ERROR 💥', error)
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
	})
}

const sendErrorProd = (error, res) => {
	// let error = { ...error };  (overwrite default error message)

	// Operational, trusted error: send abstract message to client
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		})
	} else {
		console.error('ERROR 💥', error.status, error.message)

		// Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong at our end!',
		})
	}
}

module.exports = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500
	error.status = error.status || 'error'

	if (error.name === 'CastError') error = handleCastErrorDB(error)
	else if (error.code === 11000) error = handleDuplicateFieldsDB(error)
	else if (error.name === 'ValidationError' || error.errors) error = handleValidationErrorDB(error)

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, res)
	} else if (process.env.NODE_ENV === 'production') {
		sendErrorProd(error, res)
	}
}
