require('dotenv').config()

const http = require('http')
const express = require('express')
const request = require('request')
const RED = require('node-red')
const githubAuth = require('node-red-auth-github')

// Create an Express app
const app = express()

// Create a server
const server = http.createServer(app)

const {
  PORT,
  GITHUB_USERNAME,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PROJECT_DOMAIN,
  KEEP_ALIVE,
  VIEW_WITHOUT_LOGIN,
} = process.env

const settings = {
  adminAuth: githubAuth({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    baseURL: 'https://' + PROJECT_DOMAIN + '.glitch.me/',
    users: [{ username: GITHUB_USERNAME, permissions: ['*'] }],
  }),
  httpNodeCors: {
    origin: '*',
    methods: 'GET,PUT,POST,PATCH,DELETE',
  },
  httpAdminRoot: '/',
  httpNodeRoot: '/',
  uiPort: PORT,
  // functionGlobalContext: { nodeEnv: { ...process.env } }, // DANGER: enables env to be passed to node-red
}

if (VIEW_WITHOUT_LOGIN && JSON.parse(VIEW_WITHOUT_LOGIN))
  settings.adminAuth.default = { permissions: 'read' }

const keepalive = () => {
  if (PROJECT_DOMAIN) request(
    { url: `http://${PROJECT_DOMAIN}.glitch.me/glitch-alive` },
    () => setTimeout(() => keepalive(), 55000)
  )
}

RED.init(server, settings)
RED.start()

app.use('/', express.static('public'))
app.get('/glitch-alive', (req, res) => res.json({ isAlive: true }))
app.use(settings.httpAdminRoot, RED.httpAdmin)
app.use(settings.httpNodeRoot, RED.httpNode)

server.listen(PORT, KEEP_ALIVE && JSON.parse(KEEP_ALIVE) ? keepalive : () => true)
