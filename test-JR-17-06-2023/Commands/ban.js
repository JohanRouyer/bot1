const Discord = require("discord.js")

module.exports =  {

    name: "ban",
    description: "ban un membre du serveur.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir.",
            required: true
        }, {
            type: "string",
            name: "raison",
            description: "La raison du bannissement.",
            required: false
        }
    ],

    async run(bot, message, args) {
        try {
         
            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à bannir.")
            let member = message.guild.members.cache.get(user.id)

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie."

            if(message.user.id === user.id) return message.reply("Essaie pas de te ban...")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Essaie pas de ban le Propriétaire du serveur.")
            if(member && !member.bannable) return message.reply("Ce membre n'est pas bannissable.")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu n'as pas l'autorisation de ban ce membre.")
            if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban du serveur.")

            try{
                await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``)
            } catch (err) {}

            await message.reply(`${message.user} a banni ${user.tag} pour la raison : \`${reason}\``)

            await message.guild.bans.create(user.id, {reason: reason})

        } catch (err) {

            return message.reply("Pas de membre à bannir.")
        }
        
    }
}