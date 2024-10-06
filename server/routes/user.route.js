import express from "express";
import {
    updateUser,
    deleteUser,
    getUser,
    searchUsers,
    addFriend,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend
} from "../controllers/user.controller.js";
import {
    verifyToken
} from "../utils/verifyUser.js";

const router = express.Router();

// user routes
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/details/:id', verifyToken, getUser);
router.get('/search/:username', verifyToken, searchUsers);

// friend routes
router.post('/add-friend', verifyToken, addFriend);
router.post('/accept-request', verifyToken, acceptFriendRequest);
router.post('/decline-request', verifyToken, declineFriendRequest);
router.post('/remove-friend', verifyToken, removeFriend);

export default router;