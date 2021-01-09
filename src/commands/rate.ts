import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js'

const Ratings = ['🇦', '🇧', '🇨']

const rateFormat = (content: string[]) => `
${content
  .map((item, i) => (i === 0 ? `**${item.trim()}**\n` : `${item.trim()}\n`))
  .join('')}
`

export const rateHandler = async (msg: Message): Promise<void> => {
  console.log('Running rate handler')
  const handler: TextChannel | NewsChannel | DMChannel = msg.channel
  const content = msg.content.split('!rate').join('').trim()

  if (content.length === 0) {
    msg.reply(
      '!rate requires at least one argument: ```!rate <item-to-rate>```\n And for multi-line divide with "|": ```!rate item | optional line 2 content | optional line 3 content```',
    )
    return
  }

  const groups = content.split('|')

  const message = await handler.send({
    content: rateFormat(groups),
  })

  try {
    await msg.delete()
    Ratings.forEach(async (rating) => {
      await message.react(rating)
    })
  } catch (e) {
    msg.reply(
      'Something went wrong with your formatting, try again, or try !help',
    )
    console.error(e)
  }
}
