const Conversation = require('../Modles/Conversation');


class ConverstationControler {
    async create(req, res) {
        const { senderId, receverId } = req.body;
        try {
            const conversationId = await Conversation.find(
                {
                    $and: [
                        {
                            $or: [
                                { member: [senderId, receverId] },
                                { member: [receverId, senderId] }
                            ]
                        }
                    ]
                });
            if (conversationId[0]) {
                res.status(200).json(conversationId[0]._id);
            }
            else {
                const newConversation = new Conversation({ member: [senderId, receverId] });
                const respons = await newConversation.save();
                res.json(respons._id);
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };

}
module.exports = new ConverstationControler;