import { Client, Message } from 'discord.js'
import { helpHandler } from './commands/help'
import { infoHandler } from './commands/info'
import { rateHandler } from './commands/rate'
import { remindMeHandler } from './commands/remind-me'
import { shopHandler } from './commands/shop'
import { voteHandler } from './commands/vote'
import { smartDevHandler } from './commands/smartDevs'
import { sendMessageHandler } from './commands/sendMessage'
import { emojiHandler } from './commands/emoji'
import { clearHandler } from './commands/clear'

export class GoatBot {
  public client: Client | null = null
  public token = ''

  public init(): void {
    this.client = new Client()
  }

  public async login(): Promise<void> {
    if (!process.env.BOT_TOKEN) {
      throw new Error('Cannot run bot without bot token')
    }
    const token = await this.client?.login(process.env.BOT_TOKEN)
    if (!token) {
      console.error('[Goat Bot] Could not login - check logs')
    }
  }
  // Attach all event listeners
  public setup(): void {
    // Do any high level connection stuff here, including listeners
    this.client?.on('message', this.onMessage)
    this.client?.on('ready', this.onReady)
  }

  public destroy(): void {
    console.info('Deactivating bot')
    this.client?.destroy()
    this.client = null
  }

  public onMessage(msg: Message): void {
    const ignoredCases =
      msg.member?.user.username === 'goat-bot' ||
      msg.author.bot ||
      !msg.content.startsWith('!')
    // goat-bot ignores himself and other bots
    if (ignoredCases) {
      return
    }

    try {
      if (matchCommand(msg) === 'message') {
        BotCommandHandlers.message(msg, [this])
      } else {
        BotCommandHandlers[matchCommand(msg) || 'help'](msg)
      }
    } catch (e) {
      console.error(e)
      msg.reply('I am Error. Check the logs, buddy')
    }
  }

  public onReady(): void {
    console.info(`Client ready, logged in as ${this.client?.user?.tag}`)
    console.log('[Goat Bot] I am awake!')
  }

  public async activate(): Promise<void> {
    this.init()
    this.setup()
    await this.login()
  }

  public deactivate(): void {
    this.destroy()
  }
}

export interface ClientAsJSON {
  shard: null
  users: string[]
  guilds: string[]
  channels: string[]
  user: string | null
}

export const BotCommands = {
  help: '!help',
  vote: '!vote',
  rate: '!rate',
  info: '!info',
  'remind-me': '!remind-me',
  shop: '!shop',
  lights: '!lights',
  message: '!message',
  emote: '!emote',
  clear: '!clear',
}

export const BotCommandHandlers: Record<
  BotCommand,
  (msg: Message, ...args: unknown[]) => void | Promise<void>
> = {
  vote: voteHandler,
  rate: rateHandler,
  help: helpHandler,
  info: infoHandler,
  'remind-me': remindMeHandler,
  shop: shopHandler,
  lights: smartDevHandler,
  message: sendMessageHandler,
  emote: emojiHandler,
  clear: clearHandler,
}

type BotCommand = keyof typeof BotCommands

const matchCommand = (msg: Message): BotCommand | null => {
  for (const key of Object.keys(BotCommands) as [BotCommand]) {
    if (msg.content.startsWith(BotCommands[key])) {
      return key
    }
  }

  return null
}
