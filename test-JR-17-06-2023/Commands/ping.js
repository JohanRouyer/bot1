const Discord = require("discord.js")

module.exports = {
    
    name: "ping",
    description: "ping le bot discord.",
    Permission: "Aucune",
    dm: true,

    async run(bot, message, args) {
        
        await message.reply(`Ping : \`${bot.ws.ping}\``)
    }
}