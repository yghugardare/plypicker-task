import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: "admin" | "team-member";
}

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    // no two docs should have same email
    unique: true,
    // match regex
    // start with one or more character followed by @ followed by
    // domain followed by dot followed by one or more character
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    // Eg - yash Ghugardare => yashGhugardare
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "team-member"],
    required: [true, "Select a valid role!"],
  },
});

// if the user model is already defined , during multiple hot reloads
// in next js it prevents the code from redefining the user model again and again ,
// by returning the existing model , and if model does not exist
// then it will create a new model
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model("User", UserSchema);

export default User;

// Note - User model will be stores as "users" document in mongodb
