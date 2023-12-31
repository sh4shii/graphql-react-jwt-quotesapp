import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./graphql/typedefs.js";
import resolvers from "./graphql/resolvers.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDb from "./config/dbConnection.js";

dotenv.config();

connectDb();

// middleware for authentication
const context = ({ req }) => {
  const token = req.headers.authorization;
  if (token) {
    const { userId } = jwt.verify(token.replace("Bearer ", ""), "UNSAFE STRING"); // Remove "Bearer " prefix
    return { userId };
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  context,
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at ${url}`);
