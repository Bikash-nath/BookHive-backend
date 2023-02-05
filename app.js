const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const authorRouter = require('./routes/authorRoutes');
const userProfileRouter = require('./routes/userProfileRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cors = require('cors');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //to log req/res info
}

//Set security HTTP headers
app.use(helmet());

//Implement CORS
app.use(cors());
app.options('*', cors());

//Body parser
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/users/profile', userProfileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
