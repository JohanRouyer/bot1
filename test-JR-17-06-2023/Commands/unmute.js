const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    
    name: "unmute",
    description: "unmute un membre du serveur.",
    Permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options:[
        {
            type: "user",
            name: "membre",
            description: "Le membre à unmute.",
            required: true
        },{
            type: "string",
            name: "raison",
            description: "La raison du unmute.",
            required: false
        }
    ],

    async run(bot, message, args) {
        
        try {
         
            let user = args.getUser("membre")
            if(!user) return message.reply("Pas de membre à unmute.")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("ce membre n'est pas sur le serveur.")

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie."

            if(message.user.id === user.id) return message.reply("Essaie pas de t'unmute...")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Essaie pas de unmute le Propriétaire du serveur.")
            if(member && !member.moderatable) return message.reply("Ce membre ne peut pas être unmute.")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu n'as pas l'autorisation de unmute ce membre.")
            if(!member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute.")

            try{
                await user.send(`Tu as été unmute du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``)
            } catch (err) {}

            await message.reply(`${message.user} a unmute ${user.tag} pour la raison : \`${reason}\``)

            await member.timeout(null, reason)

        } catch (err) {

            return message.reply("Pas de membre à mute.")
        }
    }
}