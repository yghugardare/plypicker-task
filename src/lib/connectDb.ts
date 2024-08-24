import mongoose from "mongoose";
// Used connection pooling and caching connections to prevent app
// process from getting "choked", ie, opening too many connections
// as Next.js is an Edge time framework.

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDb(): Promise<void> {
  // check if we have a connection to the db
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  // attempt to connect to db
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      bufferCommands: false,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("Mongo DB connected successfully!");
  } catch (error) {
    console.error("MONGO DB Connection failed!", error);
    // exit from the process
    process.exit(1);
  }
}

export default connectDb;
