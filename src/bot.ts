import { Client, Message } from 'discord.js'
import { helpHandler } from './commands/help'
import { rateHandler } from './commands/rate'
import { voteHandler } from './commands/vote'

const client = new Client()

client.on('ready', () => {
  console.info(`Client ready, logged in as ${client.user?.tag}`)
})

export const BotCommands = {
  help: /^!help/,
  vote: /^!vote/,
  rate: /^!rate/,
}

export const BotCommandHandlers: Record<
  BotCommand,
  (msg: Message) => void | Promise<void>
> = {
  vote: voteHandler,
  rate: rateHandler,
  help: helpHandler,
}

type BotCommand = keyof typeof BotCommands

const matchCommand = (msg: Message): BotCommand | null => {
  for (const key of Object.keys(BotCommands) as [BotCommand]) {
    if (msg.content.match(BotCommands[key])) {
      return key
    }
  }

  return null
}

client.on('message', (msg) => {
  try {
    // goat-bot ignores himself and other bots
    if (
      msg.member?.user.username === 'goat-bot' ||
      msg.author.bot ||
      !msg.content.startsWith('!')
    ) {
      return
    }

    BotCommandHandlers[matchCommand(msg) || 'help'](msg)
  } catch (e) {
    console.error(e)
    msg.reply('I am Error. Check the logs, buddy')
  }
})

// Do any high level connection stuff here
client.on('ready', () => {
  console.log('I am awake!')
})

// Logging in
export const activateBot = async (): Promise<string> => {
  if (!process.env.BOT_TOKEN) {
    throw new Error('Cannot run bot without bot token')
  }

  console.info('Activating bot')
  return await client.login(process.env.BOT_TOKEN)
}

export const deactivateBot = (): void => {
  console.info('Deactivating bot')
  client.destroy()
}

export default client
