import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
}

export const createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ 
            username,
            password,
            balance: 1000
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "Invalid data" });
    }
}

