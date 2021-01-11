import { Client, Message } from 'discord.js'
import { rateHandler } from './commands/rate'
import { voteHandler } from './commands/vote'

const client = new Client()

client.on('ready', () => {
  console.info(`Client ready, logged in as ${client.user?.tag}`)
})

export const BotCommands = {
  Help: /^!help/,
  Vote: /^!vote/,
  Rate: /^!rate/,
}

const matchCommand = (msg: Message) => {
  if (msg.content.match(BotCommands.Help)) {
    voteHandler(msg)
  }

  // The main vote command
  if (msg.content.match(BotCommands.Vote)) {
    voteHandler(msg)
  }

  if (msg.content.match(BotCommands.Rate)) {
    rateHandler(msg)
  }
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

    matchCommand(msg)
  } catch (e) {
    console.error(e)
    msg.reply('I am Error. Check the logs, buddy')
  }
})

client.on('ready', () => {
  console.log('I am awake!')
})

// Logging in
export const activateBot = async (): Promise<string> => {
  if (!process.env.BOT_TOKEN) {
    throw new Error('Cannot run bot without bot token')
  }

  return await client.login(process.env.BOT_TOKEN)
}

export const deactivateBot = (): void => {
  client.destroy()
}

export default client
