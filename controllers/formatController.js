const Format = require('../models/formatModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllAudiobooks = factory.getAll(Format, 'type chapters book');
exports.getAllEbooks = factory.getAll(Format, 'type pages book');
