const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book-controller");

router.get("/:userId/unread", bookController.getAllUnreadBooksForUser);
router.get("/:userId/read", bookController.getAllReadBooksForUser);
router.get("/:bookId", bookController.getBookById);
router.post("/", bookController.postBookForUser);
router.put("/:userId/update/:bookId", bookController.updateIsReadForUser);
router.delete("/:userId/delete/:bookId", bookController.deleteBookForUser);

module.exports = router;
