const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const authorRouter = require('./routes/authorRoutes');
const genreRouter = require('./routes/genreRoutes');
const userProfileRouter = require('./routes/userProfileRoutes');
const userLibraryRouter = require('./routes/userLibraryRoutes');
const formatRouter = require('./routes/formatRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //to log req/res info
}

//Set security HTTP headers
// app.use(helmet());

app.use(cookieParser());

//Implement CORS
// origin: true,
const corsOptions = {
  credentials: true, //access-control-allow-credentials:true
  origin: ['https://bookhive.vercel.app', 'http://localhost:3000'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'x-client-key',
    'x-client-token',
    'x-client-secret',
    'Authorization',
  ],
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors());

//Body parser
app.use(express.json({ limit: '10kb' }));
app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/genres', genreRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/users/profile', userProfileRouter);
app.use('/api/users/library', userLibraryRouter);

app.use(express.static('public'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
