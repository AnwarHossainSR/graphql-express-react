require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db");
const schema = require("./schema");
const cors = require("cors");
const authMiddleware = require("./middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// GraphQL API
app.use(
  "/graphql",
  authMiddleware,
  graphqlHTTP((req) => ({
    schema,
    context: { user: req.user },
    graphiql: true,
  }))
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
