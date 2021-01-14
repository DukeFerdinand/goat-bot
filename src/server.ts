import * as dotenv from 'dotenv'
import express from 'express'
import { ClientAsJSON, GoatBot } from './bot'

const app = express()
app.use(express.json())

// Use a singleton to simulate a global state
const bot = new GoatBot()

app.use((req, res, next) => {
  const provided = req.headers.authorization,
    expected = process.env.NODE_AUTH_KEY

  if (!expected) {
    throw new Error('NODE_AUTH_KEY not found in env')
  }

  if (provided === expected) {
    next()
  } else {
    res.send(403).json({
      message: 'Please provide the expected API token',
    })
  }
})

app.get('/health', (req, res) => {
  console.log('Health check')

  res.status(200).json({
    client: bot.client?.toJSON(),
  })
})

app.post('/start', async (req, res) => {
  console.info('[ Signal ] - Start')

  const c = bot.client?.toJSON() as ClientAsJSON | undefined
  console.log(c)
  if (!c?.user) {
    const status = await bot.activate()
    res.status(200).json({
      status,
      client: c,
    })
  } else {
    res.status(409).json({
      message: 'Will not activate bot, as bot is already running',
    })
  }
})

app.post('/stop', (req, res) => {
  console.info('[ Signal ] - Stop')

  const c = bot.client?.toJSON() as ClientAsJSON | undefined
  if (c && c.user) {
    bot.destroy()
    res.status(200).end()
  } else {
    res.status(409).json({
      message: 'Will not deactivate bot, as bot is already deactivated',
    })
  }
})

app.get('/bot-status', (req, res) => {
  if (bot.client) {
    res.status(200).json({
      status: 'active',
    })
  } else {
    res.status(200).json({
      status: 'inactive',
    })
  }
})

app.post('/restart', async (req, res) => {
  console.info('[ Signal ] - Restart')
  bot.destroy()

  const status = await bot.activate()
  res.json({
    status,
    client: bot.client?.toJSON(),
  })
})

app.listen(8000, '0.0.0.0', async () => {
  console.log('listening on 0.0.0.0:8000')

  // ENV vars
  dotenv.config()

  // Bot initial setup, acts as the first "activate" call
  await bot.activate()
})
