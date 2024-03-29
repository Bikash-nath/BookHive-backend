const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const filterObj = require('../utils/filterObject');

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({ slug: req.params.slug, ...req.docFilter });
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find({}), { ...req.query, ...req.docFilter })
      .limitFields()
      .filter()
      .sort()
      .paginate();
    const doc = await features.query;

    // const doc = await Model.find({}).select(projection);

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const filteredDoc = filterObj(req.body, Object.keys(req.docFilter)[0]);
    console.log('book-review', { ...req.body, ...req.docFilter });
    const doc = await Model.create({ ...req.body, ...req.docFilter });
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({ slug: req.params.slug, ...req.docFilter }, req.body);
    // const doc = await Model.findByIdAndUpdate(req.params.slug, req.body, {
    //   new: true,
    //   runValidators: true,   //doc.save()
    // });

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ slug: req.params.slug, ...req.docFilter });
    // const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
