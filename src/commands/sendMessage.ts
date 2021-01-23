import { Message } from 'discord.js'
import { GoatBot } from '../bot'

import { bot } from '../server'

const heikkiSpecialMessage = `
Hey Heikki!

I heard you're feeling bad, so I got Duke to agree to getting you a record tomorrow :)

Also if there's anything I can do, let me know. I'm a goat but I'm not too dumb.


P.S. I can't read, so don't try to respond :(
`

export const sendMessageHandler = async (
  msg: Message,
  args: unknown,
): Promise<void> => {
  msg.reply('Working on it')
}
