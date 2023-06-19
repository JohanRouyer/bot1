const Discord = require("discord.js")

module.exports =  {

    name: "kick",
    description: "kick un membre du serveur.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à kick.",
            required: true
        }, {
            type: "string",
            name: "raison",
            description: "La raison du kick.",
            required: false
        }
    ],

    async run(bot, message, args) {
        try {
         
            let user = args.getUser("membre")
            if(!user) return message.reply("Pas de membre à kick.")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("ce membre n'est pas sur le serveur.")

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie."

            if(message.user.id === user.id) return message.reply("Essaie pas de te kick...")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Essaie pas de kick le Propriétaire du serveur.")
            if(member && !member.kickable) return message.reply("Ce membre ne peut pas être kick.")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu n'as pas l'autorisation de kick ce membre.")

            try{
                await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``)
            } catch (err) {}

            await message.reply(`${message.user} a kick ${user.tag} pour la raison : \`${reason}\``)

            await member.kick(reason)

        } catch (err) {

            return message.reply("Pas de membre à kick.")
        }
        
    }
}