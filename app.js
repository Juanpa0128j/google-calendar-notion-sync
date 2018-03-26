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

// Create the settings object - see default settings.js file for other options
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
  functionGlobalContext: { nodeEnv: { ...process.env } }, // DANGER: enables env to be passed to node-red
}

if (VIEW_WITHOUT_LOGIN && JSON.parse(VIEW_WITHOUT_LOGIN))
  settings.adminAuth.default = { permissions: 'read' }

const keepalive = () => {
  const reqOpts = {
    url: 'http://' + process.env.PROJECT_DOMAIN + '.glitch.me/its-alive',
  }
  const keepalive = () =>
    request(reqOpts, () => setTimeout(() => keepalive(), 55000))
  // if this is running on Glitch, call self every 55 secs
  if (process.env.PROJECT_DOMAIN) keepalive()
}

// Initialise the runtime with a server and settings
RED.init(server, settings)
// Add a simple route for static content served from 'public'
app.use('/', express.static('public'))
// Glitch keepalive
app.get('/its-alive', (req, res) => res.json({ isAlive: true }))
// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin)
// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode)
// Start the runtime
RED.start()
// start the server
server.listen(PORT, KEEP_ALIVE && JSON.parse(KEEP_ALIVE) ? keepalive : () => true)
