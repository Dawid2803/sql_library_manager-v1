var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const url = require('url');

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
}));

//get books listing from db
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

//get new book view
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});
}));

//posts new book row in db
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body)
    res.redirect('/books');
  } catch (error) {
    if(error.name === 'SequelizeValidationError'){
      book = await Book.build(req.body);
      console.log(error);
      res.render('new-book', { book, errors: error.errors, title: "New Book" })
    }else {
      throw error;
    }
  }

}));

//get book details
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: 'Update Book'} )
  } else {
    res.status(404);
    res.render('page-not-found', {err: {message: "Oops looks like the page you were looking for does not exist!", status: 404}})
  }
}));

//update book details
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/books');
    }else{
      res.status(404);
      res.render('page-not-found', {err: {message: "Oops looks like the page you were looking for does not exist!", status: 404}})  
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors, title:"Update Book"});
    }else{
      throw error;
    }
    
  }

}));

//deletes books
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.status(404);
    res.render('page-not-found', {err: {message: "Oops looks like the page you were looking for does not exist!", status: 404}})  
  }
}));

module.exports = router;
