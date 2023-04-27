const mongoose = require('mongoose')
const slugify = require('slugify')

const genreSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		unique: true,
		required: [true, 'A genre must have a title'],
		maxlength: [50, 'A genre title must have atmost 30 characters'],
	},
	slug: { type: String, trim: true, unique: true },
	books: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Book',
		},
	],
})

genreSchema.index({ slug: 1 })

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
genreSchema.pre('save', function (next) {
	this.slug = slugify(this.title)
	next()
})

const Genre = mongoose.model('Genre', genreSchema)
module.exports = Genre
