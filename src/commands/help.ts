import { Message } from 'discord.js'

const helpMessage = `
Hi there! Here's how you can talk to me:
\`\`\`
Commands:

Help:
  !help - Displays this message

Ratings:
  !rate <thing to rate> - Rate anything A, B, or C
  !rate <thing to rate> | <line 2> | <line 3> | ... - Add more lines with | as a separator

Info:
  !info - Get admin info and nerd stats

\`\`\`
`

export const helpHandler = async (msg: Message): Promise<void> => {
  const dm = await msg.author.createDM()
  dm.send(helpMessage)
}
