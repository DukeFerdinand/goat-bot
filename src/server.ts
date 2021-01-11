import * as dotenv from 'dotenv'
import express from 'express'
import client, { activateBot, deactivateBot } from './bot'

// Init env

const app = express()

app.get('/health', (req, res) => {
  console.log('Health check')

  res.status(200).json({
    client: client.toJSON(),
  })
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
