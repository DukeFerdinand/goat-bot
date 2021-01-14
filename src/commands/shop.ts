import { Message } from 'discord.js'
import { ShopConnection } from '../services/shop'
import { sendToChannel } from '../utils'

type Subcommand = (p: [Message, ...string[]]) => void | Promise<void>

const shopService = new ShopConnection()

const newHandler: Subcommand = async (p) => {
  const [msg, ...args] = p
  const name = args.join(' ').trim()

  const result = await shopService.newList(name)

  sendToChannel(msg, JSON.stringify(result))
}

/**
 * Show shopping lists
 */
const showShopHandler: Subcommand = async (p) => {
  const [msg, ...args] = p
  const name = args.join(' ').trim()

  const result = await shopService.getList(name)

  if (result) {
    console.log(result)
    sendToChannel(msg, JSON.stringify(result))
  } else {
    sendToChannel(msg, `List "${name}" not found`)
  }
}

const helpHandler: Subcommand = (p) => {
  const [msg, args] = p
  msg.channel.send(shopHelpMessage)
}

const ShopCommands: Record<string, Subcommand> = {
  new: newHandler,
  help: helpHandler,
  show: showShopHandler,
}
type ShopCommand = keyof typeof ShopCommands

export const shopHelpMessage = `
Shop command help
\`\`\`
Help
 !shop help - show this message
New
  !shop new <shopping-list> - creates (and selects) a new shopping list
\`\`\`

`

export const shopHandler = async (msg: Message): Promise<void> => {
  if (msg.channel.isText()) {
    msg.channel.send('[WIP Command!]')
  }

  if (msg.content.split(' ').length === 1) {
    msg.reply('Command for !shop not provided. See help below')
    ShopCommands.help([msg])
    return
  }

  const split = msg.content.split(' ')
  split.shift()
  const [command, ...args] = split as [ShopCommand, ...string[]]

  console.log(ShopCommands[command || 'help'])

  ShopCommands[command || 'help']([msg, ...args])
}
