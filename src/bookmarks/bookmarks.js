const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./bookmarks-service')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
})

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')

      BookmarksService.getAllBookmarks(knexInstance)
        .then(bookmarks => {
         res.json(bookmarks.map(bookmark=> ({
           id: bookmark.id,
           title: bookmark.title,
           url: bookmark.url,
          description: bookmark.description,
        
         })))
        })
        .catch(next)

  })
  .post(bodyParser, (req, res, next) => {
   
    const { title, url, rating, description } = req.body;
    const parsedRating = parseInt(rating);

    if(!title) {
      logger.error('Title is required')
      return res
        .status(400)
        .send('Invalid Data');
    }
    if(!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid Data');
    }

    const insertBookmark = {
      title: title,
      rating: rating,
      url: url,
      description: description
    }

    const knexInstance = req.app.get('db')

    BookmarksService.insertBookmark(knexInstance, insertBookmark)
      .then(returnObject => {
          return res.json(returnObject)
      })
      .catch(next)
  })

  bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
      const { id } = req.params;
      const parseId = parseInt(id);

      const knexInstance = req.app.get('db')
    
      BookmarksService.getBookmarkById(knexInstance, id)
      .then(returnObject => {
          return res.json(serializeBookmark(returnObject))
      })
      .catch(next)
      
    })
    .delete((req, res, next) => {
      const { id } = req.params;
      const knexInstance = req.app.get('db')

      BookmarksService.deleteBookmark(knexInstance, id)
      .then(returnObject => {
          return res.json(serializeBookmark(returnObject))
      })
      .catch(next)
    })



module.exports = bookmarksRouter;
  