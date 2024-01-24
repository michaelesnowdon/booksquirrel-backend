const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");

//test comments endpoint

router.get("/:bookId/comments", commentController.getAllCommentsForBook);
router.post("/:userId/comment/:bookId", commentController.createCommentForUser);
router.delete(
  "/:userId/comment/:commentId/delete",
  commentController.deleteCommentForUser
);

module.exports = router;
