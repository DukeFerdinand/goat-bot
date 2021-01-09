import { Message } from "discord.js";

export const voteHandler = (msg: Message) => {
  const commandContents = msg.content.split('!gvote')[1].trim()
  const options = commandContents.split(', ')

  console.log(options)
  if (options.length === 0 || options[0] === '') {
    msg.reply("You can't have 0 options in a vote, we don't live in communist Sweden!")
  } else {

    options.forEach((option, i) => {
      msg.reply(`Voting on ${i + 1}: ${option}`)
    })
  }
}