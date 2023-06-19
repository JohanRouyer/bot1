const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    
    name: "mute",
    description: "Mute un membre du serveur.",
    Permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options:[
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute.",
            required: true
        },{
            type: "string",
            name: "temps",
            description: "Le temps du mute.",
            required: true
        },{
            type: "string",
            name: "raison",
            description: "La raison du mute.",
            required: false
        }
    ],

    async run(bot, message, args) {
        
        try {
         
            let user = args.getUser("membre")
            if(!user) return message.reply("Pas de membre à mute.")
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("ce membre n'est pas sur le serveur.")


            let time = args.getString("temps")
            if(!time) time = "Pas de durée fournie."

            if(isNaN(ms(time))) return message.reply("Ce n'est pas le bon format.")
            if(ms(time) > 2419200000 ) return message.reply("Le mute ne peut pas durer plus de 28 jours.")

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie."

    

            if(message.user.id === user.id) return message.reply("Essaie pas de te mute...")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Essaie pas de mute le Propriétaire du serveur.")
            if(member && !member.moderatable) return message.reply("Ce membre ne peut pas être mute.")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu n'as pas l'autorisation de mute ce membre.")
            if(member.isCommunicationDisabled()) return message.reply("Membre déjà mute du serveur.")
            
            try{
                await user.send(`Tu as été mute du serveur ${message.guild.name} par ${message.user} pendant ${time} pour la raison : \`${reason}\``)
            } catch (err) {}

            await message.reply(`${message.user} a mute ${user.tag} pendant ${time} pour la raison : \`${reason}\``)

            await member.timeout(ms(time), reason)

        } catch (err) {

            return message.reply("Pas de membre à mute.")
        }
    }
}