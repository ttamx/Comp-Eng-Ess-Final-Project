import Room from "../models/roomModel.js";
import User from "../models/userModel.js";

export const getRooms = async (req, res) => {
	try {
		const rooms = await Room.find();
		res.status(200).json(rooms);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export const getRoomById = async (req, res) => {
	const { id } = req.params;
	try {
		const room = await Room.findOne({ _id: id });
		res.status(200).json(room);
	} catch (error) {
		res.status(404).json({ error: "Room not found" });
	}
}

export const createRoom = async (req, res) => {
	const { roomName, ownerId } = req.body;
	try {
		const owner = await User.findOne({ _id: ownerId });
		if (!owner) {
			return res.status(404).json({ error: "User not found" });
		}
		const room = await Room.create({ 
			name: roomName,
			owner: ownerId,
			players: [ownerId]
		});
		res.status(201).json(room);
	} catch (error) {
		res.status(400).json({ error: "Invalid data" });
	}
}

export const addUserToRoom = async (req, res) => {
	const { roomId, userId } = req.body;
	try {
		const room = await Room.findOne({ _id: roomId });
		if (!room) {
			return res.status(404).json({ error: "Room not found" });
		}
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		if (!room.players.includes(userId)) {
			room.players.push(userId);
			await room.save();
		}
		res.status(200).json(room);
	} catch (error) {
		res.status(400).json({ error: "Invalid data" });
	}
}