import { uptime } from 'process'
import { Message, MessageEmbed } from 'discord.js'

import { EmbedColors } from '../utils/colors'
import { bot } from '../server'
import { getConfig } from '../utils/config'

const projectConfig = getConfig()

export const blankField = {
  name: '\u200b',
  value: '\u200b',
}

const projectJSON = `
\`\`\`
${JSON.stringify(projectConfig, null, 2)}
\`\`\`
`

export const infoHandler = (msg: Message): void => {
  const embed = new MessageEmbed()
    .setColor(EmbedColors.Info)
    .setTitle('Goat Bot Info')
    .setThumbnail(bot.client?.user?.displayAvatarURL() || '')
    .setDescription('Nerd Stats for Goat Bot')
    .addFields([
      {
        name: 'Server Uptime',
        value: Math.floor(uptime()),
      },
      {
        inline: true,
        name: 'Express Hostname',
        value: `\`${JSON.stringify(process.env.NODE_ENV)}\``,
      },
      {
        inline: true,
        name: 'Environment',
        value: `\`${JSON.stringify(process.env.NODE_ENV)}\``,
      },
      {
        name: 'Project Config',
        value: projectJSON,
      },
    ])
    .setTimestamp()
  if (msg.channel.isText()) {
    msg.channel.send(embed)
  }
}
