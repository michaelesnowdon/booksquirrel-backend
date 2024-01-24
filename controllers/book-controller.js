const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUnreadBooksForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Use Prisma to find all books for the user where isRead is false
    const unreadBooks = await prisma.bookUser.findMany({
      where: {
        userId,
        isRead: false,
      },
      include: {
        book: true, // Include book details in the result
      },
    });

    res.status(200).json(unreadBooks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching unread books for the user");
  }
};

const getAllReadBooksForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Use Prisma to find all books for the user where isRead is true
    const readBooks = await prisma.bookUser.findMany({
      where: {
        userId,
        isRead: true,
      },
      include: {
        book: true, // Include book details in the result
      },
    });

    res.status(200).json(readBooks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching read books for the user");
  }
};

const postBookForUser = async (req, res) => {
  try {
    const {
      userId,
      bookId,
      title,
      author,
      category,
      description,
      thumbnail,
      pageCount,
    } = req.body;

    // Check if the book exists in the Book model
    let existingBook = await prisma.book.findUnique({
      where: {
        isbn: bookId,
      },
    });

    // If the book doesn't exist, create it in the Book model
    if (!existingBook) {
      existingBook = await prisma.book.create({
        data: {
          isbn: bookId,
          title,
          author,
          category,
          description,
          thumbnail,
          pageCount,
        },
      });
    }

    // Check if the user has added the book in the BookUser model
    const existingBookUser = await prisma.bookUser.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingBookUser) {
      return res.status(400).json({ error: "User already has this book" });
    }

    // Create a new book-user relationship
    const newBookUser = await prisma.bookUser.create({
      data: {
        userId,
        bookId,
        isRead: false,
        addedDate: new Date(),
      },
    });

    res.status(201).json(newBookUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while posting the book for the user");
  }
};

// Example body request for postBookForUser

// {
//   "userId": "unique_user_id_2",
//   "bookId": "9780123456789",
//   "title": "Sample Book Title",
//   "author": "Sample Author",
//   "category": "Fiction",
//   "description": "A sample book description",
//   "thumbnail": "https://example.com/book-thumbnail.jpg",
//   "pageCount": 300
// }

const updateIsReadForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    // Use Prisma to update the isRead field to true
    const updatedBookUser = await prisma.bookUser.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json(updatedBookUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the isRead status");
  }
};

const deleteBookForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    // Check if the book exists for the user and is marked as unread (isRead = false)
    const existingBookUser = await prisma.bookUser.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!existingBookUser || existingBookUser.isRead === true) {
      return res
        .status(400)
        .json({ error: "Book not found or is marked as read" });
    }

    // Delete the book-user relationship if it's marked as unread
    await prisma.bookUser.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the book");
  }
};

module.exports = {
  getAllUnreadBooksForUser,
  getAllReadBooksForUser,
  postBookForUser,
  updateIsReadForUser,
  deleteBookForUser,
};
