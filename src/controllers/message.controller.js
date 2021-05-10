const Message = require("../models/Message");
const User = require("../models/User");

// find messages by recipient
exports.findByRecipient = async (recipientId, userId) => {
    try {
        const messages = Message.find({
            $or: [
                { recipient: recipientId, creator: userId },
                { recipient: userId, creator: recipientId }
            ]
        }
        ).sort({ created_date: 1 })

        return messages;
    } catch (error) {
        throw error
    }
}

exports.getListInbox = async (userId) => {
    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ "recipient": userId }, { "creator": userId }]
                },
            },
            { $sort: { created_date: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            {
                                $eq: [
                                    "$creator",
                                    userId
                                ]
                            },
                            {
                                $concat: [
                                    {
                                        $toString: "$creator"
                                    },
                                    " and ",
                                    {
                                        $toString: "$recipient"
                                    }
                                ]
                            },
                            {
                                $concat: [
                                    {
                                        $toString: "$recipient"
                                    },
                                    " and ",
                                    {
                                        $toString: "$creator"
                                    }
                                ]
                            }
                        ]
                    },
                    latestMessage: { "$first": "$text" },
                    created_date: { "$first": "$created_date" },
                    sender: { "$first": "$creator" },
                    recipient: { "$first": "$recipient" }
                }
            },
            {
                $sort: {
                    created_date: -1
                }
            }
        ]);

        if (conversations && conversations.length > 0) {
            const data = await Promise.all(conversations.map(async (item) => {
                const id = userId.toString() === item.sender.toString() ? item.recipient : item.sender;
                item.conversation = await User.findOne({ _id: id });
                delete item._id;
                delete item.sender;
                delete item.recipient;
                return item;
            }));
            return data;
        }
    } catch (error) {
        throw error
    }
}

exports.createNewMessage = async (data) => {
    try {
        data.created_date = new Date().getTime();
        const message = new Message(data);
        await message.save();
        return message
    } catch (error) {
        throw error
    }
}