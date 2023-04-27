const mongoose = require('mongoose')
// const validator = require('validator');

const userUploadSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'UserProfile',
	},
	bookType: {
		type: String,
		enum: ['orignal', 'summary', 'story', 'poem', 'blog'],
	},
	format: {
		type: mongoose.Schema.ObjectId,
		ref: 'Format',
	},
	book: {
		type: mongoose.Schema.ObjectId,
		ref: 'Book',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

userUploadSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'book',
		select: 'title image author slug',
	})
	next()
})

const UserUpload = mongoose.model('UserUpload', userUploadSchema)
module.exports = UserUpload
