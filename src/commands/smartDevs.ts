import { Message } from 'discord.js'
import { Client, Plug } from 'tplink-smarthome-api'

export const smartDevHandler = async (msg: Message): Promise<void> => {
  const client = new Client()

  // Placeholder, please update
  const dev = await client.getDevice({ host: '10.0.1.104' })
  const state = await dev.getPowerState()
  await dev.setPowerState(!state)

  msg.reply(`State of ${JSON.stringify(!state)}`)
}
