const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userResolver = {
  Query: {
    async getUsers() {
      return await User.find();
    },
    async getUserById(_, { id }) {
      return await User.findById(id);
    },
  },
  Mutation: {
    async register(_, { input }) {
      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return { ...user._doc, id: user.id, token };
    },
    async login(_, { input }) {
      const { email, password } = input;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return { ...user._doc, id: user.id, token };
    },
  },
};

module.exports = userResolver;
