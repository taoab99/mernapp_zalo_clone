const Message = require('../Modles/Message');


class MessageControler {
    async postMessages(req, res) {
        const { conversationId, senderId, text } = req.body;
        try {
            const message = new Message({
                conversationId,
                senderId,
                text
            });
            const saveMessage = await message.save();
            res.status(200).json(saveMessage)
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };
    async getMessage(req, res) {
        const { conversationId } = req.query;
        const newMessages = await Message.find({ conversationId });
        res.json(newMessages);
    }
};

module.exports = new MessageControler;