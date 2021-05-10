const express = require('express')
const Message = require('../models/Message')
const auth = require('../middleware/auth')
const User = require('../models/User');
const { findByRecipient, getListInbox } = require('../controllers/message.controller');
const router = express.Router()
const API_ENDPOINT = '/api/messages'

// find messages by recipient
router.get(`${API_ENDPOINT}/inbox/detail/:recipientId`, auth, async (req, res) => {
    try {
        const recipientId = req.params.recipientId;
        const currentId = req.user._id;
        const messages = await findByRecipient(recipientId, currentId);
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// get list user inbox
router.get(`${API_ENDPOINT}/inbox/list`, auth, async (req, res) => {
    try {
        const currentId = req.user._id;
        const conversations = await getListInbox(currentId);
        res.status(200).send(conversations);
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

//send message
router.post(API_ENDPOINT, auth, async (req, res) => {
    try {
        const data = req.body;
        data.creator = req.user._id;
        data.created_date = new Date().getTime();
        const message = new Message(data);
        await message.save();
        res.status(200).send({ message });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

module.exports = router;
