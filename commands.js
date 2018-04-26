module.exports = (bot) => {
    bot.on('/start', (msg) => {
        bot.sendMessage(msg.from.id, msg.text);
        console.log('received message:', msg);
    });
}