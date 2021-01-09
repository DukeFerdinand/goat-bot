import { Message } from 'discord.js'

const Ratings = ['🇦', '🇧', '🇨']

export const rateHandler = async (msg: Message) => {
  const targetChannel = msg.guild?.channels.cache.find((channel) => {
    return channel.name === 'ratings'
  })

  const message = await msg.channel.send({
    content: `**${'<placeholder>'}**`,
  })
  try {
    Ratings.forEach(async (rating) => {
      await message.react(rating)
    })
  } catch (e) {
    console.error(e)
  }
  // message.react(':dogdance:')

  // const commandContents = msg.content.split('!grate')[1].trim()
  // const options = commandContents.split(', ')

  // console.log(options)
  // if (options.length === 0 || options[0] === '') {
  //   msg.reply('No options provided, rating you instead. Rating: F')
  // } else {
  //   options.forEach((option, i) => {
  //     msg.reply(`Rating on ${i + 1}: ${option}`)
  //   })
  // }
}
