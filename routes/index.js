var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* Redirect home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
  //res.render('index', { title: 'Express' });
}));

//get books listing from db
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

//create new books row in db
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}});
}));

//create new books row in db
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body)
  res.redirect('/books');

}));

router.get('/books/:id', asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  res.send(bookId);
}));

router.post('/books/:id', asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  res.send(bookId);
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
}));

module.exports = router;
