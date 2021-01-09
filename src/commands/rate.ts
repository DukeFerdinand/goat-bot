import { Message } from "discord.js"

export const rateHandler = (msg: Message) => {

  const commandContents = msg.content.split('!grate')[1].trim()
  const options = commandContents.split(', ')

  console.log(options)
  if (options.length === 0 || options[0] === '') {
    msg.reply("No options provided, rating you instead. Rating: F")
  } else {

    options.forEach((option, i) => {
      msg.reply(`Voting on ${i + 1}: ${option}`)
    })
  }
}
