import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: String,
	maxScore: Number,
	maxDistance: Number
});

const User = mongoose.model("User", userSchema);

export default User;
