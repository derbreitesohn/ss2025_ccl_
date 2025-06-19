const express = require('express');
const router = express.Router();
const authenticationService = require('../services/authentication');
const messageModel = require('../models/messageModel');

router.get('/recent', authenticationService.authenticateJWT, async (req, res) => {
    try {
        const chats = await messageModel.getRecentChats(req.user.id);
        res.json({ chats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/history/:otherUserId', authenticationService.authenticateJWT, async (req, res) => {
    try {
        const history = await messageModel.getChatHistory(req.user.id, req.params.otherUserId);
        res.json({ history });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;