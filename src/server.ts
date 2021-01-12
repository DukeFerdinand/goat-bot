import * as dotenv from 'dotenv'
import express from 'express'
import client, { activateBot, deactivateBot } from './bot'

const app = express()
app.use(express.json())

app.get('/health', (req, res) => {
  console.log('Health check')

  res.status(200).json({
    client: client.toJSON(),
  })
})

app.post('/start', async (req, res) => {
  console.info('[ Signal ] - Start')

  const status = await activateBot()
  res.status(200).json({
    status,
    client: client.toJSON(),
  })
})

app.post('/stop', (req, res) => {
  console.info('[ Signal ] - Stop')
  deactivateBot()

  res.status(200).end()
})

app.post('/restart', async (req, res) => {
  console.info('[ Signal ] - Restart')
  deactivateBot()

  const status = await activateBot()
  res.json({
    status,
    client: client.toJSON(),
  })
})

app.listen(8000, '0.0.0.0', async () => {
  console.log('listening on 0.0.0.0:8000')

  // ENV vars
  dotenv.config()

  // Bot initial setup, acts as the first "activate" call
  await activateBot()
})
