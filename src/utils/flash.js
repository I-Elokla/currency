function hasMessages(messages) {
    return Object.values(messages).some(message => message && message.length > 0);
}

module.exports = {
    hasMessages
};