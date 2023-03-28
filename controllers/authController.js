const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/user/userProfileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, //can't be accessed or modified by browser
    secure: true, //send cookie only on HTTPS conn.
    sameSite: 'none',
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.Set("Set-Cookie",`jwt=${token}`)

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // Remove password field from created User
  user._id = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: user,
    // jwt: token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = Object.keys(req.body).filter((field) => field !== 'role');
  if (req.body.email === req.body.password) {
    return next(new AppError('Please provide different strong password!', 400));
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // phoneNo: req.body.phoneNo,
  // gender: req.body.gender,
  // dob: req.body.dob,
  // photo: req.body.photo,
  // occupation: req.body.occupation,
  // address: req.body.address,

  newUser.role = undefined;
  newUser.deleted = undefined;

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('req.headers', req.headers);

  // 1) Check if email and password exist
  if (!email) {
    return next(new AppError('Please provide your email!', 400));
  } else if (!password) {
    return next(new AppError('Please provide your password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Send JWT to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 24 * 1000 * 60),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token from headers
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Token Verification - payload & expiry
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes('admin') && userRole === 'admin') {
      next(); //need to pass admin doc filter
    } else if (req.method === 'POST' && userRole === roles[0]) {
      req.docFilter = { [userRole]: req.user.id };
      return next();
    }
    if (roles.includes(userRole)) {
      req.docFilter = { [userRole]: req.user.id };
      return next();
    }
    return next(new AppError('You do not have permission to perform this action', 403));
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`No user found with email ${req.body.email}`, 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request before 10 minutes with your New password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  console.warn('message:-', message);

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Password reset token ⚠️',
    //   message,
    // });
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Token sent to email!',
    // });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordReset = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

exports.updateEmail = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id);

  // 2) Verify email
  if (user.email !== req.body.email) {
    return next(new AppError('Your current email is incorrect.', 401));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, { email: req.body.newEmail });

  // 3) Send JWT to client
  createSendToken(updatedUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) Update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  // 4) Send JWT to client
  createSendToken(user, 200, res);
});
