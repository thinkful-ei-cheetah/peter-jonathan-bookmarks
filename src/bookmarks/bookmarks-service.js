const BookmarksService = {
    getAllBookmarks(knex) {
        found = knex.select('*').from('bookmarks');
        return found
    },
    insertBookmark(knex, insertBookmark) {
        return knex.insert(insertBookmark).into('bookmarks');
    },
    deleteBookmark(knex, id){
        return knex('bookmarks')
        .where('id', id)
        .del()
    },
    updateBookmark(knex, insertBookmark){

    },
    getBookmarkById(knex, id) {
       const found = knex.from('bookmarks').select('*').where('id', id).first()
       return found
    }
  }

module.exports = BookmarksService;