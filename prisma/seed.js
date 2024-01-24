const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      kindeId: "user1_kindeId",
      firstName: "Alice",
      lastName: "Smith",
      joined: new Date(),
      book: {
        create: {
          isbn: "book1_isbn",
          title: "Prisma for Beginners",
          author: "Alice Smith",
          category: "Technology",
          addedDate: new Date(),
          //   userId: "user1_kindeId", // This should match kindeId of user1
        },
      },
      comments: {
        create: {
          //   commenter: "user1_kindeId", // This should match kindeId of user1
          comment: "Great book on Prisma!",
          commentedBook: "book1_isbn", // This should match isbn of book1
          createdAt: new Date(),
        },
      },
    },
  });

  // Add more users, books, and comments as needed
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
