require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { jwtVerify } = require("@kinde-oss/kinde-node-express");
const verifier = jwtVerify(process.env.KINDE_URL);
const PORT = process.env.PORT;

const bookRoutes = require("./routes/book-routes");
const commentRoutes = require("./routes/comment-routes");
const userRoutes = require("./routes/user-routes");

app.use(express.json());
app.use(cors());
app.use(verifier);

app.get("/", (req, res) => {
  res.status(200).send("this is the / api endpoint ");
});

app.use("/api/books", bookRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
