import { Message } from 'discord.js'
import { removeCommand } from '../utils/commands'

export const Emotes = {
  ['bird-o']: '<:BirdO:781630946642362409>',
}

export const emojiHandler = (msg: Message, ...args: unknown[]): void => {
  if (msg.channel.isText()) {
    const content = removeCommand(msg.content)
    msg.channel.send(`\`${content}\``)
  }
}
