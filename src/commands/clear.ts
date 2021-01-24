import { Message } from 'discord.js'
import { bot } from '../server'
import { getConfig } from '../utils/config'
import { Embeds } from '../utils/embeds'

const clearableChannels: Array<string> = getConfig().clearableChannels

export const clearHandler = async (
  msg: Message,
  ..._: unknown[]
): Promise<void> => {
  const channelId = msg.channel.id

  if (clearableChannels.includes(channelId)) {
    await msg.reply('Clearing this channel')
    const cachedChannel = bot.client?.channels.cache.get(channelId)

    if (cachedChannel?.isText()) {
      const fetched = await cachedChannel.messages.fetch()
      console.info(`[${channelId}] Deleting ${fetched.size} messages`)
      fetched.map(async (m) => {
        await m.delete()
      })

      console.info(`[${channelId}] Deleted messages`)
    }
  } else {
    if (msg.channel.isText()) {
      msg.channel.send(
        Embeds.error({ message: 'Cannot clear protected channel' }),
      )
    }
  }
}
