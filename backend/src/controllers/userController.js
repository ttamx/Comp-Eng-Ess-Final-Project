import User from "../models/userModel.js";

export const sendScore = async (req, res) => {
    try{
        const { username, score, distance } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            const newUser = await new User({
                username: username,
                maxScore: score,
                maxDistance: distance,
            });
            await newUser.save();
            res.status(201).json(newUser); 
        } else {
            if (score > user.maxScore) {
                user.maxScore = score;
            }
            if (distance > user.maxDistance) {
                user.maxDistance = distance;
            }
            await user.save();
            res.status(200).json(user);
        }
    } catch (error) {
		res.status(500).json({ error: "Internal Server Error"});
	}
}

export const getLeaderboard = async (req, res) => {
    try{
        const users = await User.find().sort({ maxScore: -1 }).limit(100);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
    }
}

