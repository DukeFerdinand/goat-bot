import { Message } from 'discord.js'

export const sendToChannel = async (
  msg: Message,
  text: string,
): Promise<Message | void> => {
  if (msg.channel.isText()) {
    return msg.channel.send(text)
  }
}
