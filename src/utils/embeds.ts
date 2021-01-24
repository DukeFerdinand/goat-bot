import { MessageEmbed } from 'discord.js'
import { EmbedColors } from './colors'

export const Embeds = {
  error: (config: { title?: string; message: string }): MessageEmbed => {
    return new MessageEmbed()
      .setColor(EmbedColors.Error)
      .setTitle(config.title || 'Error')
      .setDescription(config.message)
  },
}
