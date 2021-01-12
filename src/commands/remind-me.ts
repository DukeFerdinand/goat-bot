import { Message } from 'discord.js'
import { BotCommands } from '../bot'

export const remindMeHandler = async (msg: Message): Promise<void> => {
  let formattedContent: string | string[] = msg.content.split(
    BotCommands['remind-me'],
  )[1]

  if (formattedContent.length === 0) {
    msg.reply(
      'Invalid reminder format, please see `!help` for more information',
    )

    return
  }

  formattedContent = formattedContent.trim().split('|')

  if (formattedContent.length === 1) {
    msg.reply(
      `
Missing reminder duration. Try: \`!remind-me\ ${formattedContent[0]} | <time>\`

See \`!help\` for more information
      `,
    )

    return
  }

  const title = formattedContent[0].trim(),
    duration = formattedContent[1].trim(),
    dm = await msg.author.createDM()

  dm.send(`Got it! I'll DM you in ${duration} about "${title}"`)
}
