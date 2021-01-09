import * as dotenv from 'dotenv'
import Discord, { Client } from 'discord.js'
import { rateHandler } from './commands/rate'
import { voteHandler } from './commands/vote'

// Init env
dotenv.config()

const client = new Client()

client.on('ready', () => {
  console.info(`Client ready, logged in as ${client.user?.tag}`)
})

const BotCommands = {
  Help: /^!ghelp/,
  Vote: /^!gvote/,
  Rate: /^!grate/,
}

client.on('message', (msg) => {
  try {
    const test = ''
    // He ignores himself
    if (msg.member?.user.username === 'goat-bot') {
      return
    }
    if (msg.content.match(BotCommands.Help)) {
      msg.reply(
        'Help function is still marked TODO, blame my creator for being dumb',
      )
    }

    // The main vote command
    if (msg.content.match(BotCommands.Vote)) {
      voteHandler(msg)
    }

    if (msg.content.match(BotCommands.Rate)) {
      rateHandler(msg)
    }
  } catch (e) {
    console.error(e)
    msg.reply('I am Error. Check the logs, buddy')
  }
})

if (!process.env.BOT_TOKEN) {
  throw new Error('Cannot run bot without bot token')
}

client.login(process.env.BOT_TOKEN)
