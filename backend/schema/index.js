const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const userResolver = require("../resolvers/userResolver");
const taskResolver = require("../resolvers/taskResolver");

// Type Definitions
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TaskInput {
    title: String!
    description: String
    status: String
  }

  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
    getTasks: [Task]
    getTaskById(id: ID!): Task
  }

  type Mutation {
    register(input: RegisterInput!): User
    login(input: LoginInput!): User
    createTask(input: TaskInput!): Task
    updateTask(id: ID!, input: TaskInput!): Task
    deleteTask(id: ID!): String
  }
`;

// Merge Resolvers
const resolvers = {
  Query: {
    ...userResolver.Query,
    ...taskResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...taskResolver.Mutation,
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
