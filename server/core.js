require('dotenv').config();
const Mailgun = require('./email/mailgun');
const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const Unsubscribe = require('./models/Unsubscribe');
const SurpriseSongs = require('./models/SurpriseSong');
const Leaderboards = require('./models/Leaderboard');
const Concert = require('./models/Concert');
const Outfit = require('./models/Outfit');
const app = express();
const http = require('http').createServer(app); // Create an HTTP server instance
const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' ? /https?:\/\/(\w+\.)?erastourleagues\.com/ : 'http://localhost:3000',
  credentials: true,
});

const io = require('socket.io')(http, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? /https?:\/\/(\w+\.)?erastourleagues\.com/ : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
}); // Create a Socket.io instance and attach it to the server

app.set('io', io);
const session = require('express-session');

const port = process.env.PORT || 3001;

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

const { DraftMachineManager } = require('./draft/draftMachineManager');
DraftMachineManager.io = io;

mongoose
  .connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@swiftball0.tnporuv.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
  })
  .then(async () => {
    /**
     * startup tasks
     */
    console.log('mongo connected');
    await DraftMachineManager.onServerRestart();
    await Mailgun.sendTestEmail();
  })
  .catch(console.error);

app.use(corsMiddleware);

app.use(express.json());

const expressSessionMiddleware = session({
  secret: process.env.SESSION_KEY || 'nevergonnagiveyouup',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  },
});

app.use(expressSessionMiddleware);

const identity = require('./endpoints/identity');
app.use('/identity', identity);

const invite = require('./endpoints/invite');
app.use('/invite', invite);

const league = require('./endpoints/league');
app.use('/league', league);

const gameboard = require('./endpoints/gameboard');
app.use('/gameboard', gameboard);

const admin = require('./endpoints/admin');
app.use('/admin', admin);

app.get('/', (req, res) => {
  res.status(200).send('OK');
});
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

io.engine.use(expressSessionMiddleware);

const socketCookieCheck = require('./middleware/socketCookieCheck');
io.use(socketCookieCheck);
io.on('connection', socket => {
  const leagueId = socket.handshake.query.leagueId;

  if (!leagueId) {
    // If leagueId is missing, refuse the connection
    socket.disconnect();
    return;
  }

  socket.join(leagueId);

  // Listen for the 'disconnect' event
  socket.on('disconnect', () => {});
});

app.use((err, req, res, next) => {
  // Handle the error in a graceful way
  console.error(err);

  // Send an appropriate response to the client
  res.status(500).json({ error: 'Internal Server Error' });
});

http.listen(port, () => {
  console.log('Server is running...');
});
