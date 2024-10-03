import User from "../models/user.model.js";
import {
    errorHandler
} from "../utils/error.js";
import bcryptjs from "bcryptjs";


// update user
export const updateUser = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                },
            }, {
                new: true
            }
        );
        const {
            password,
            ...rest
        } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


// delete user
export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can delete only your account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (error) {
        next(error);
    }

}

export const getUser = async (req, res, next) => {
    const foundUser = await User.findById(req.params.id)
        .select("-__v")
        .populate("cardio")
        .populate("resistance")

    if (!foundUser) {
        return res.status(400).json({
            message: 'Cannot find a user with this id!'
        });
    }

    res.json(foundUser);
};

// Add Friend by Username
export const addFriend = async (req, res, next) => {
    const {
        friendUsername
    } = req.body;

    try {
        // Find the friend by username
        const friend = await User.findOne({
            username: friendUsername
        });
        if (!friend) {
            return res.status(404).json("User not found.");
        }
        // Compare user IDs instead of usernames
        if (req.user.id === friend._id) {
            return res.status(400).json("You cannot add yourself as a friend!");
        }

        const user = await User.findById(req.user.id);
        if (user.friends.includes(friend._id)) {
            return res.status(400).json("This user is already your friend.");
        }

        // Add to the sender's sent requests and recipient's incoming requests
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: {
                sentFriendRequests: friend.username
            },
        });

        await User.findByIdAndUpdate(friend._id, {
            $addToSet: {
                friendRequests: user.username
            },
        });

        res.status(200).json('Friend request sent successfully.');
    } catch (error) {
        next(error);
    }
};

// Accept Friend Request by Username
export const acceptFriendRequest = async (req, res, next) => {
    const {
        friendUsername
    } = req.body;

    try {
        // Find the friend by username
        const friend = await User.findOne({
            username: friendUsername
        });
        if (!friend) {
            return res.status(404).json("User not found.");
        }

        // Add each user to the other's friends list by Username
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: {
                friends: friend.username
            },
        });
        const user = await User.findById(req.user.id);
        await User.findByIdAndUpdate(friend._id, {
            $addToSet: {
                friends: user.username
            },
        });

        // Remove the request from the user's friend requests
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                friendRequests: friend.username
            },
        });
        await User.findByIdAndUpdate(friend._id, {
            $pull: {
                friendRequests: user.username
            },
        });
        res.status(200).json('Friend request accepted.');
    } catch (error) {
        next(error);
    }
};

// Decline Friend Request by Username
export const declineFriendRequest = async (req, res, next) => {
    const {
        friendUsername
    } = req.body;

    try {
        // Find the friend by username
        const friend = await User.findOne({
            username: friendUsername
        });
        if (!friend) {
            return res.status(404).json("User not found.");
        }

        // Remove the request from the user's friend requests
        const user = await User.findById(req.user.id);
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                friendRequests: friend.username
            },
        });
        await User.findByIdAndUpdate(friend._id, {
            $pull: {
                sentFriendRequests: user.username
            },
        });

        res.status(200).json('Friend request declined.');
    } catch (error) {
        next(error);
    }
};

// Remove Friend by Username
export const removeFriend = async (req, res, next) => {
    const {
        friendUsername
    } = req.body;

    try {
        // Find the friend by username
        const friend = await User.findOne({
            username: friendUsername
        });
        if (!friend) {
            return res.status(404).json("User not found.");
        }

        // Remove the request/friend from the user's friend requests
        const user = await User.findById(req.user.id);
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                friends: friend.username
            },
        });
        await User.findByIdAndUpdate(friend._id, {
            $pull: {
                friends: user.username
            },
        });
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                sentFriendRequests: friend.username
            },
        });
        await User.findByIdAndUpdate(friend._id, {
            $pull: {
                friendRequests: user.username
            },
        });
        res.status(200).json('Friend request declined.');
    } catch (error) {
        next(error);
    }
};


// Search Users by Username
export const searchUsers = async (req, res, next) => {
    const {
        username
    } = req.params;
    try {
        const users = await User.find({
            username: {
                $regex: `^${username}`,
                $options: 'i'
            },
        }).select('username');

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};