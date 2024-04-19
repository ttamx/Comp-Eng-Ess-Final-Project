import User from "../models/userModel.js";

export const sendScore = async (req, res) => {
    try{
        const { username, score, distance } = req.body;
        var user = await User.findOne({ username });
        if(!user){
            user = User.create({ username, maxScore: score, maxDistance: distance });
            res.status(200).json(user);
        }else{
            if(score > user.maxScore){
                user.maxScore = score;
            }
            if(distance > user.maxDistance){
                user.maxDistance = distance;
            }
            res.status(200).json(user);
        }
        await user.save();
    } catch (error) {
		res.status(404).json({ error: "Room not found" });
	}
}

