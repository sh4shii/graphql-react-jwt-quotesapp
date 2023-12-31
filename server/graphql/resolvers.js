import { quotes, users } from "../fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Quote from "../models/Quote.js";

const resolvers = {
  Query: {
    users: async () => await User.find({}),
    user: async (_, { _id }) => await User.findById({ _id }),
    quotes: async () => await Quote.find({}).populate("by", "_id firstName"),
    iquote: async (_, { by }) => await Quote.find({ by }),
    myprofile: async (_, args, { userId }) => {
      if (!userId) throw new Error("You must be logged in");
      return await User.findOne({ _id: userId });
    },
  },
  User: {
    quotes: async (user) => await Quote.find({ by: user._id }),
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exists with that email");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 10);

      const newUser = {
        ...userNew,
        password: hashedPassword,
      };
      return await User.create(newUser);
    },
    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User dosent exists with this email");
      }
      const isPasswordCorrect = await bcrypt.compare(
        userSignin.password,
        user.password
      );
      if (!isPasswordCorrect) {
        throw new Error("email or password is invalid");
      }
      const token = jwt.sign({ userId: user._id }, "UNSAFE STRING", {
        expiresIn: "2h",
      });
      return { token };
    },
    createQuote: async (_, { name }, { userId }) => {
      if (!userId) throw new Error("You must be logged in");
      await Quote.create({
        name,
        by: userId,
      });
      return "Quote saved successfully";
    },
  },
};

export default resolvers;
