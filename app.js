const http = require('http')
const express = require('express')
const RED = require('node-red')
const keepalive = require('./util/glitchKeepalive')

// Create an Express app
const app = express()

// Create a server
const server = http.createServer(app)

const {
  GITHUB_CLIENT_ID,
} = 

const adminAuth = require('node-red-auth-github')({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    baseURL: "http://localhost:1880/",
    users: [
       { username: "knolleary",permissions: ["*"]}
    ]
})

// Create the settings object - see default settings.js file for other options
const settings = {
  adminAuth: {
    type: 'credentials',
    users: [
      {
        username: process.env.USERNAME,
        password: process.env.SECRET,
        permissions: '*',
      },
    ],
  },

  // httpNodeCors: {
  //   origin: '*',
  //   methods: 'GET,PUT,POST,PATCH,DELETE',
  // },
  httpAdminRoot: '/',
  httpNodeRoot: '/',
  uiPort: 8080,
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

server.listen(8080, keepalive)

// Start the runtime
RED.start()
