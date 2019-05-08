const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarksRouter = express.Router();

const bodyParser = express.json();

const bookmarks = [
  {
    title: "Google",
    rating: 5,
    url: "http://google.com",
    description: "The best search engine ever.",
    id: 1,
  },
  {
    title: "IMDB",
    rating: 5,
    url: "http://imdb.com",
    description: "The best movie search engine ever.",
    id: 2,
  },
  {
    title: "Facebook",
    rating: 5,
    url: "http://facebook.com",
    description: "The best time sink ever.",
    id: 3,
  }
]

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    const knexInstance = req.app.get('db')
  })
  .post(bodyParser, (req, res) => {
    const { title, rating, url, description } = req.body;
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
    if(!url) {
      logger.error('Url is required')
      return res
        .status(400)
        .send('Invalid Data');
    }
    if(!description) {
      logger.error('Description is required')
      return res
        .status(400)
        .send('Invalid Data');
    }
    const id = uuid();

    const bookmark = {
      title,
      rating: parsedRating,
      url,
      description,
      id
    }
    bookmarks.push(bookmark);

    logger.info(`List with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
  })

  bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
      const { id } = req.params;
      const parseId = parseInt(id);
      const bookmark = bookmarks.find(bm => bm.id === parseId);

      if(!bookmark) {
        logger.error(`List with id ${id} not found.`);
        return res
          .status(404)
          .send('List Not Found');
      }

      res.json(bookmarks);
    })
    .delete((req, res) => {
      const { id } = req.params;
      const index = bookmarks.findIndex(bm => bm.id == id);

      if(index === -1) {
        logger.error(`List with id ${id} not found.`);
        return res
          .status(404)
          .send('Not Found');
      }

      bookmarks.splice(index, 1);

      logger.info(`List with id ${id} deleted.`);
      res
        .status(204)
        .end();
    })

module.exports = bookmarksRouter;
  