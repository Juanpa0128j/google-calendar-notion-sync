require('dotenv').config()

const http = require('http')
const express = require('express')
const RED = require('node-red')
const githubAuth = require('node-red-auth-github')

const keepalive = require('./keepalive')

// Create an Express app
const app = express()

// Create a server
const server = http.createServer(app)

const {
  PORT,
  ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PROJECT_DOMAIN,
  KEEP_ALIVE,
} = process.env

const adminAuthStatic = {
  type: 'credentials',
  users: [
    {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD_HASH,
      permissions: '*',
    },
  ],
}

// Create the settings object - see default settings.js file for other options
const settings = {
  adminAuth: githubAuth({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    baseURL: 'https://' + PROJECT_DOMAIN + '.glitch.me/',
    users: [{ username: ADMIN_USERNAME, permissions: ['*'] }],
    default: {
      permissions: 'read',
    },
  }),

  // httpNodeCors: {
  //   origin: '*',
  //   methods: 'GET,PUT,POST,PATCH,DELETE',
  // },
  httpAdminRoot: '/',
  httpNodeRoot: '/',
  uiPort: PORT,
  functionGlobalContext: {}, // enables global context
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

server.listen(PORT, KEEP_ALIVE ? keepalive : () => true )

// Start the runtime
RED.start()
