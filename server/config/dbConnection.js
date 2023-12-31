import mongoose from "mongoose";

const CONNECTION_STRING =
  "mongodb+srv://skumarz:skumarz@graphqlreact.sbk7kvo.mongodb.net/graphQLreact?retryWrites=true&w=majority";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(CONNECTION_STRING);
    console.log(
      "Database connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDb;
