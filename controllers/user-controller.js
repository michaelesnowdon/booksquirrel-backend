const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const allUsers = await prisma.user.findMany();

    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching users from the database");
  }
};

const addUser = async (req, res) => {
  try {
    const { kindeId, firstName, lastName } = req.body;

    // Check if a user with the same kindeId already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        kindeId,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this kindeId already exists" });
    }

    // If no existing user found, create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        kindeId,
        firstName,
        lastName,
        // 'joined' date will be set to default (now) as defined in the schema
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user");
  }
};

//Example post request to add a new user

// {
//   "kindeId": "unique_user_id_1",
//   "firstName": "John",
//   "lastName": "Doe"
// }

module.exports = {
  addUser,
  getAllUsers,
};
