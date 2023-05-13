const mongoose = require('mongoose')

const userActivitySchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'UserProfile',
	},
	// collections: [
	//   {
	//     type: mongoose.Schema.ObjectId,
	//     ref: 'UserLibrary',
	//   },
	// ],
	readLater: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Book',
		},
	],
	readHistory: [
		{
			book: {
				type: mongoose.Schema.ObjectId,
				ref: 'Book',
			},
			//remainingTime & lastReadAt
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	// downloadHistory: [
	//   {
	//     book: {
	//       type: mongoose.Schema.ObjectId,
	//       ref: 'Book',
	//     },
	//     createdAt: {
	//       type: Date,
	//       default: Date.now,
	//     },
	//   },
	// ],
	// searchHistoy: [  // store locally in devices
	//   {
	//     searchTerm: String,
	//     time: {
	//       type: Date,
	//       default: Date.now,
	//     },
	//   },
	// ],
	devices: [
		{
			name: String,
			ipAddress: String,
			lastLoggedIn: Date,
			active: {
				type: Boolean,
				default: true,
			},
			select: false,
		},
	],
})

const UserActivity = mongoose.model('UserActivity', userActivitySchema)
module.exports = UserActivity
