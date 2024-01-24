const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCommentsForBook = async (req, res) => {
  try {
    const bookId = req.params.bookId; // ID or ISBN of the book

    // Use Prisma to find all comments for the specified book
    const commentsForBook = await prisma.comment.findMany({
      where: {
        commentedBook: bookId,
      },
      include: {
        user: true, // Include user details for each comment
      },
    });

    res.status(200).json(commentsForBook);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching comments for the book");
  }
};

const createCommentForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const { comment } = req.body;

    // Check if the book and user exist
    const existingBook = await prisma.book.findUnique({
      where: {
        isbn: bookId,
      },
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        kindeId: userId,
      },
    });

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new comment for the user on the book
    const newComment = await prisma.comment.create({
      data: {
        commenter: userId, // Associate the comment with the user's kindeId
        comment,
        commentedBook: bookId, // Associate the comment with the book's ISBN
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the comment");
  }
};

//Example post body

// {
//   "comment": "This book is a must-read! I loved it."
// }

const deleteCommentForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // ID of the authenticated user
    const commentId = req.params.commentId; // ID of the comment to be deleted

    // Check if the comment exists and get the commenter's ID
    const existingComment = await prisma.comment.findUnique({
      where: {
        commentId,
      },
      select: {
        commenter: true,
      },
    });

    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const commenterId = existingComment.commenter;

    // Check if the authenticated user is the commenter
    if (commenterId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    // If the user is the commenter, delete the comment
    await prisma.comment.delete({
      where: {
        commentId,
      },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the comment");
  }
};

module.exports = {
  getAllCommentsForBook,
  createCommentForUser,
  deleteCommentForUser,
};
