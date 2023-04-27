const mongoose = require('mongoose')

const formatSchema = new mongoose.Schema({
	ebook: {
		fileType: {
			type: String,
			enum: ['ePub', 'PDF'],
		},
		pagesCount: Number,
		link: {
			type: String,
			trim: true,
		},
	},
	audiobook: {
		fileType: {
			type: String,
			enum: ['mp3', 'm4b'],
		},
		chapters: [
			{
				count: Number,
				title: String,
				link: {
					type: String,
					trim: true,
				},
				length: {
					hours: Number,
					mins: Number,
				},
				size: Number,
			},
		],
		releasedYear: {
			type: Date,
			select: false,
		},
	},
	book: {
		type: mongoose.Schema.ObjectId,
		ref: 'Book',
	},
})

const Format = mongoose.model('Format', formatSchema)
module.exports = Format

// fileType: {
//   type: String,
//   enum: ['mp3', 'm4b'],
// },
