var http = require('http')
var express = require('express')
var RED = require('node-red')
var keepalive = require('./util/glitchKeepalive')

// Create an Express app
var app = express()

// Add a simple route for static content served from 'public'
app.use('/', express.static('public'))

// Create a server
var server = http.createServer(app)

// Create the settings object - see default settings.js file for other options
var settings = {
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

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin)

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode)

// Glitch keepalive
app.get('/its-alive', (req, res) => res.json({ isAlive: true }))

server.listen(8080, keepalive)

// Start the runtime
RED.start()
