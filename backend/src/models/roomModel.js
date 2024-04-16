import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
	name: String,
	owner: String,
	players: Array,
	deck: Array,
	hands: Array,
	communityCards: Array,
	bets: Array,
	pots: Array,
	playerPot: Array,
	currentPlayerIndex: Number,
	round: String
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
