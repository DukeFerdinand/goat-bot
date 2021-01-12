import { Message } from 'discord.js'

const helpMessage = `
Goat Bot usage:

\`\`\`
Commands:
  Help: Displays this message
  !help

  Ratings: Rate anything A, B, or C. Add more lines with | as a separator
  !rate <thing to rate>
  !rate <thing to rate> | <line 2> | <line 3> | ...

\`\`\`
`

export const helpHandler = (msg: Message): void => {
  msg.reply(helpMessage)
}
