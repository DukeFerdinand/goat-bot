import { Message } from 'discord.js'

const infoFormat = `
Here's that info you asked for:
\`\`\`
Filler info here

This is to be used for things like total active reminders, uptime, health check...

Basically a mini dashboard
\`\`\`

`

export const infoHandler = (msg: Message): void => {
  if (msg.channel.isText()) {
    msg.channel.send(infoFormat)
  }
}
