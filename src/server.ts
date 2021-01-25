import * as dotenv from 'dotenv'
import express from 'express'
import marked from 'marked'

import { ClientAsJSON, GoatBot } from './bot'

const app = express()
app.use(express.json())

// Use a singleton to simulate a global state
export const bot = new GoatBot()

const publicRoutes = [/\/(help|health|progress)\/?.*/]

const routeMatcher = (route: string, routeMatches: Array<RegExp>): boolean => {
  for (const regex of routeMatches) {
    return route.match(regex) !== null
  }
  return false
}

app.use((req, res, next) => {
  const provided = req.headers.authorization,
    expected = process.env.NODE_AUTH_KEY,
    route = req.path

  if (!expected) {
    throw new Error('NODE_AUTH_KEY not found in env')
  }

  if (provided === expected || routeMatcher(route, publicRoutes)) {
    next()
  } else {
    res.status(403).json({
      message: 'Please provide the expected API token',
    })
  }
})

const withBaseHTML = (content: string) => `
<html>
  <head>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      * {
        font-family: 'Open Sans';
        box-sizing: border-box;
      }
      body, html {
        padding: 0;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div style="
        display: flex;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        flex-direction: column;
      "
    >
      <div
        style="
          padding: 15px;
          width: 50%;
          height: 100%;
          box-shadow: 0 0 5px 0 gray;
          margin: 0 auto;
        "
      >
        ${content}
      </div>
    </div>
  </body>
</html>
`

const progressBarHTML = (percentage = 0) => `
<html>
  <head>
    <style>
      * {
        padding: 0;
        margin: 0;
        background: rgba(0,0,0,0);
        box-sizing: border-box;
      }
      html, body {
        width: 400px;
        height: 30px;
      }
      .progress-bar {
        position: relative;
        width: 400px;
        background: #222;
        height: 30px;
        border-radius: 5px;
        overflow: hidden;
      }
      .progress-indicator {
        height: 100%;
        width: ${percentage}%;
        background: #FFAA63;
      }
      .text-content {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 25px;
        font-size: 15px;
        color: #FEFEFE;
        font-family: sans-serif;
      }
    </style>
    <title>Progress Bar</title>
  </head>
  <body>
    <div class="progress-bar">
      <div class="progress-indicator"></div>
      <div class="text-content">
        <span>500/1000 EXP</span>
      </div>
    </div>
  </body>
</html>
`

const renderMarkdown = (content: string) => withBaseHTML(marked(content))

app.get('/help', (req, res) => {
  res.status(200).type('html').send(
    renderMarkdown(
      `
# How to use goat bot
- test
- test
- test
`,
    ),
  )
})

app.get('/health', (req, res) => {
  console.log('Health check')

  res.status(200).json({
    message: 'Goat Bot server is okay',
    clientRunning: !!bot.client,
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

app.get('/progress', (req, res) => {
  res.status(200).contentType('html').send(progressBarHTML(50))
})

app.listen(8000, '0.0.0.0', async () => {
  console.log('listening on 0.0.0.0:8000')

  // ENV vars
  dotenv.config()

  // Bot initial setup, acts as the first "activate" call
  await bot.activate()
})
